import React, { SetStateAction } from "react";
import { Box, TextField, Typography } from "@material-ui/core";
import { ITodo } from "models/ITodo";

type TodoHeaderProps = {
  todo: ITodo;
  setTodo: (value: SetStateAction<ITodo>) => void;
};

const TodoHeader = ({ todo, setTodo }: TodoHeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      mb={2}
    >
      <TextField
        label="Title"
        variant="outlined"
        value={todo.title}
        onChange={(e) => {
          setTodo({ ...todo, title: e.target.value });
        }}
      />
      <Typography>
        Owner: {todo.creator.profile.firstName} {todo.creator.profile.lastName}
      </Typography>
    </Box>
  );
};

export default TodoHeader;