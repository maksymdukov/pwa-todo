import { TodoRequest } from "models/ITodoRequest";
import { TodosIDBSync } from "./todos-idb-sync";
import { IDB } from "services/idb.service";
import { TodosService } from "services/todos.service";

export abstract class TodoSyncRequest {
  constructor(
    public todosSyncService: TodosIDBSync,
    public db: IDB,
    public todosService: TodosService
  ) {}
  abstract handleOutboundRequest(request: TodoRequest): Promise<void>;
}
