import React, { MutableRefObject } from "react";
import { Box, IconButton, Paper, TextField } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  label: {
    padding: "0 16px",
    fontSize: "1.5rem",
  },
  input: {
    flexGrow: 1,
  },
});

interface TodoRecordProps {
  content: string;
  index: number;
  last: boolean;
  lastItemRef: MutableRefObject<HTMLTextAreaElement | null>;
  refs: MutableRefObject<{ [key: number]: HTMLTextAreaElement }>;
  onContentChange: (idx: number, value: string) => void;
  dragProps?: DraggableProvidedDragHandleProps;
  editable: boolean;
}

const TodoRecord = ({
  lastItemRef,
  refs,
  last,
  content,
  index,
  onContentChange,
  dragProps,
  editable,
}: TodoRecordProps) => {
  const classes = useStyles();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onContentChange(index, e.target.value);
  };
  return (
    <Paper elevation={2}>
      <Box display="flex" alignItems="center" p={1}>
        <TextField
          disabled={!editable}
          inputRef={(r: HTMLTextAreaElement) => {
            refs.current[index] = r;
            if (last) {
              lastItemRef.current = r;
            }
          }}
          multiline
          className={classes.input}
          value={content}
          onChange={onChange}
        />
        <IconButton disableTouchRipple {...dragProps} disabled={!editable}>
          <DragIndicatorIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default TodoRecord;
