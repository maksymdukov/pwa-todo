import React, { SetStateAction } from "react";
import { TextField, Typography, makeStyles } from "@material-ui/core";
import { ITodo } from "models/ITodo";

type TodoHeaderProps = {
  todo: ITodo;
  setTodo: (value: SetStateAction<ITodo>) => void;
  editable: boolean;
  isNew?: boolean;
};

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing(2),
    marginBottom: spacing(2),
    flexWrap: "wrap",
  },
  owner: {
    [breakpoints.down("sm")]: {
      order: -1,
      flexBasis: "100%",
      marginBottom: spacing(2),
    },
  },
  title: {
    [breakpoints.down("sm")]: {
      order: 1,
      flexBasis: "100%",
    },
  },
}));

const TodoHeader = ({ todo, setTodo, editable, isNew }: TodoHeaderProps) => {
  const classes = useStyles();
  return (
    <section className={classes.wrapper}>
      <TextField
        className={classes.title}
        disabled={!editable}
        label="Title"
        variant="outlined"
        value={todo.title}
        onChange={(e) => {
          setTodo({ ...todo, title: e.target.value });
        }}
      />
      {!isNew && (
        <div className={classes.owner}>
          <Typography variant="subtitle2">Owner</Typography>
          <Typography variant="body2">
            {todo.creator.profile.firstName} {todo.creator.profile.lastName}
          </Typography>
          <Typography variant="body2">{todo.creator.email}</Typography>
        </div>
      )}
    </section>
  );
};

export default TodoHeader;
