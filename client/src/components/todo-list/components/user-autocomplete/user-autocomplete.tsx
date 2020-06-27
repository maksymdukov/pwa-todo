import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { UserType, usersService } from "services/users.service";
import axios from "axios";
import throttle from "lodash/throttle";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { IconButton, Box, makeStyles } from "@material-ui/core";
import { ITodo } from "models/ITodo";
import { todosService } from "services/todos.service";

const useStyles = makeStyles(({}) => ({
  shareBtn: {
    flexShrink: 0,
  },
}));

interface UserAutocompleteProps {
  todo: ITodo;
}

export const UserAutocomplete = ({ todo }: UserAutocompleteProps) => {
  const classes = useStyles();
  const [value, setValue] = React.useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("value", value);
  console.log("inputValue", inputValue);

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const source = axios.CancelToken.source();

    const fetchUsers = throttle(
      async () => {
        try {
          setLoading(true);
          const { data: users } = await usersService.getUsers(
            inputValue,
            source.token
          );
          setOptions(users);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      },
      200,
      { leading: false }
    );
    fetchUsers();

    return () => {
      fetchUsers.cancel();
      source.cancel();
      setLoading(false);
    };
  }, [open, inputValue]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const onShareClick = () => {
    todosService.shareTodo(todo.id, value!.id);
    // TODO sync changes somehow
  };

  return (
    <Box display="flex" alignItems="center" m={1}>
      <Autocomplete
        id="asynchronous-demo"
        style={{ width: 300 }}
        open={open}
        inputValue={inputValue}
        value={value}
        onChange={(event: any, newValue: UserType | null) => {
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        // getOptionSelected={(option, value) => option.email === value.email}
        getOptionLabel={(option) => option.email}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Find email"
            placeholder="Start typing email..."
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <IconButton
        className={classes.shareBtn}
        disabled={!value}
        color="primary"
        title="Share"
        onClick={onShareClick}
      >
        <PersonAddOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default UserAutocomplete;
