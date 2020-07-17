import React from "react";
import { Box, FormControlLabel, Switch } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { getTodoViewType } from "store/tech/tech.selectors";
import { TodoViewType } from "store/tech/tech.reducer";
import { changeTodoViewType } from "store/tech/tech.actions";

const TodoViewSwitch = () => {
  const todoView = useSelector(getTodoViewType);
  const dispatch = useDispatch();
  const handleChange = () => {
    dispatch(
      changeTodoViewType(
        todoView === TodoViewType.masonry
          ? TodoViewType.list
          : TodoViewType.masonry
      )
    );
  };
  return (
    <Box pl={2}>
      <FormControlLabel
        control={
          <Switch
            checked={todoView === TodoViewType.masonry}
            onChange={handleChange}
            name="tiles"
          />
        }
        label="Tiles view"
      />
    </Box>
  );
};

export default TodoViewSwitch;
