import React, { useCallback, useRef, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from "react-beautiful-dnd";
import TodoRecord from "pages/single-todo/components/single-todo/elements/todo-record";
import { ITodoRecord } from "models/ITodo";
import {
  getItemStyle,
  getListStyle
} from "pages/single-todo/components/todo-records/todo-records.styles";
import { reorder } from "pages/single-todo/components/todo-records/todo-records.utils";
import NewRecord from "./elements/new-record";
import { usePrevious } from "hooks/utils";

type ContentChangeHandler = (idx: number, value: string) => void;

type TodoRecordsProps = {
  todoRecords: ITodoRecord[];
  changeTodoRecords: (value: ITodoRecord[]) => void;
};

const TodoRecords = ({ todoRecords, changeTodoRecords }: TodoRecordsProps) => {
  const lastItemRef = useRef<HTMLTextAreaElement>(null);
  const prevTodos = usePrevious(todoRecords);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      const items = reorder(
        todoRecords,
        result.source.index,
        result.destination.index
      );

      changeTodoRecords(items);
    },
    [todoRecords, changeTodoRecords]
  );

  const onContentChange = useCallback<ContentChangeHandler>(
    (idx, value) => {
      const updatedTodo = {
        ...todoRecords[idx],
        content: value,
        localTimestamp: Date.now()
      };
      changeTodoRecords(
        todoRecords.map((todo, index) => (idx === index ? updatedTodo : todo))
      );
    },
    [changeTodoRecords, todoRecords]
  );

  const onAddNewChange = (value: string) => {
    const newTodo = {
      id: new Date().toISOString(),
      content: value,
      done: false
    };
    changeTodoRecords([...todoRecords, newTodo]);
  };

  useEffect(() => {
    if (prevTodos.length < todoRecords.length && lastItemRef.current) {
      lastItemRef.current.focus();
      // move caret to the end
      const val = lastItemRef.current.value;
      lastItemRef.current.value = "";
      lastItemRef.current.value = val;
    }
  }, [todoRecords, prevTodos]);
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {todoRecords.map(({ content, id }, index) => (
                <Draggable key={id} draggableId={String(id)} index={index}>
                  {(provided, snapshot) => (
                    <article
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <TodoRecord
                        myRef={lastItemRef}
                        content={content}
                        index={index}
                        last={index === todoRecords.length - 1}
                        onContentChange={onContentChange}
                        dragProps={provided.dragHandleProps}
                      />
                    </article>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <NewRecord onAddNewChange={onAddNewChange} />
    </>
  );
};

export default TodoRecords;
