import { TodosService, todosService } from "services/todos.service";
import { TodoHistoryChange } from "models/ITodoHistoryChange";
import { getUserState } from "store/user/selectors";
import { store } from "store/store";
import { DBNames, IDB, idb } from "services/idb.service";
import { TodoHistoryReason } from "models/TodoHistoryReason";
import { KeyValKeys } from "models/KeyValStore";
import { TodoRequest, TodoRequestTypes } from "models/ITodoRequest";
import { CreateTodoSync } from "./create-todo-sync";
import { EditTodoSync } from "./edit-todo-sync";
import { DeleteTodoSync } from "./delete-todo-sync";

export const todoSyncRequests = {
  [TodoRequestTypes.create]: CreateTodoSync,
  [TodoRequestTypes.edit]: EditTodoSync,
  [TodoRequestTypes.delete]: DeleteTodoSync,
};

export class TodosIDBSync {
  constructor(public db: IDB, public todosService: TodosService) {}

  static createSyncRequest(type: TodoRequestTypes) {
    return new todoSyncRequests[type](todosSync, idb, todosService);
  }

  async handleInboundChanges(items: TodoHistoryChange[], timestamp: number) {
    // TODO workaround. Inject userIDB instead
    const userProfile = getUserState(store.getState());
    // workaround end

    const tx = (await this.db.db).transaction(DBNames.syncTodos, "readwrite");

    const promises = items.map((item) => {
      //  handle delete and unshare case
      if (
        // Deleted
        item.reason === TodoHistoryReason.deleted ||
        // Todo is unshared and I'm not in the shared list anymore and I'm not an owner of todo
        (item.reason === TodoHistoryReason.unshared &&
          item.todo.creator.id !== userProfile.id &&
          !item.todo.shared.find((share) => share.id === userProfile.id))
      ) {
        return tx.store.delete(item.todo.id);
      }
      return tx.store.put(item.todo);
    });

    // TODO Use chain of promises instead of Promise.all
    // @ts-ignore
    await Promise.all(promises);
    await tx.done;
    await this.db.keyval.set(KeyValKeys.lastTimeUpdated, String(timestamp));
  }

  async syncOutboundRequests() {
    if (await this.getIsOutboundSyncing()) {
      return;
    }
    await this.setIsOutboundSyncing();
    const requests = await this.getOutboundRequests();
    if (!requests.length) {
      await this.unsetIsOutboundSyncing();
      return;
    }
    for (const request of requests) {
      // The follwing block is needed to mitigate possible concurrency issues
      // when trying to syncOutboundRequests multiple times
      const currentRequestState = await this.getOutboundRequest(request.id);
      if (
        request.syncing ||
        !currentRequestState ||
        currentRequestState.syncing
      ) {
        continue;
      }

      await this.markRequestSyncing(request);
      try {
        await TodosIDBSync.createSyncRequest(
          request.type
        ).handleOutboundRequest(request);
      } catch (e) {
        await this.unmarkRequestSyncing(request);
        await this.unsetIsOutboundSyncing();
        throw e;
      }
    }
    await this.unsetIsOutboundSyncing();

    // Try to dispatch outbound requests again
    // in case when we were processing outbound queue new requests appeared
    await this.syncOutboundRequests();
  }

  public async getOutboundRequest(id: string) {
    return (await this.db.db).get(DBNames.outboundTodos, id);
  }

  private async getOutboundRequests() {
    return this.db.readAllData(DBNames.outboundTodos, "byCreatedAt");
  }

  async deleteOutboundRequest(id: string) {
    return this.db.deleteData(DBNames.outboundTodos, id);
  }

  async addOutboundRequest(request: TodoRequest) {
    return this.db.writeData(DBNames.outboundTodos, request);
  }

  private async setIsOutboundSyncing() {
    return this.db.keyval.set(KeyValKeys.isOutboundSyncing, "true");
  }
  private async unsetIsOutboundSyncing() {
    return this.db.keyval.set(KeyValKeys.isOutboundSyncing, "false");
  }

  private async getIsOutboundSyncing() {
    return (await this.db.keyval.get(KeyValKeys.isOutboundSyncing)) === "true";
  }

  private async markRequestSyncing(request: TodoRequest) {
    request.syncing = true;
    return this.db.writeData(DBNames.outboundTodos, request);
  }

  private async unmarkRequestSyncing(request: TodoRequest) {
    request.syncing = false;
    return this.db.writeData(DBNames.outboundTodos, request);
  }
}

export const todosSync = new TodosIDBSync(idb, todosService);
