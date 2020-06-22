import React, { ChangeEvent } from "react";
import { Paper, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  newRecord: {
    display: "flex",
    padding: 8
  }
});

type NewRecordProps = {
  onAddNewChange: (value: string) => void;
};

const NewRecord = ({ onAddNewChange }: NewRecordProps) => {
  const classes = useStyles();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length) {
      onAddNewChange(e.target.value);
    }
  };
  return (
    <div className={classes.newRecord}>
      {/*<AddIcon />*/}
      <TextField
        fullWidth
        value=""
        onChange={onChange}
        placeholder="Add new todo record"
      />
    </div>
  );
};

export default NewRecord;
