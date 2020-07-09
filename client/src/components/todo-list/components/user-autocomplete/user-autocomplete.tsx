import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { usersService } from "services/users.service";
import axios from "axios";
import throttle from "lodash/throttle";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { IconButton, Box, makeStyles } from "@material-ui/core";
import { ITodo, ISharedUser } from "models/ITodo";
import { todosService } from "services/todos.service";
import { syncTodos } from "store/todos/todos.actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(({}) => ({
  shareBtn: {
    flexShrink: 0,
  },
}));

interface UserAutocompleteProps {
  todo: ITodo;
  onSharedSuccess?: (usr: ISharedUser) => void;
}

export const UserAutocomplete = ({
  todo,
  onSharedSuccess,
}: UserAutocompleteProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState<ISharedUser | null>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<ISharedUser[]>([]);
  const [loading, setLoading] = useState(false);

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
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      200,
      { leading: false }
    );
    fetchUsers();

    return () => {
      if (open!) {
        return;
      }
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

  const onShareClick = async () => {
    await todosService.shareTodo(todo.id, value!.id);
    onSharedSuccess && onSharedSuccess(value!);
    setOptions([]);
    setValue(null);
    setInputValue("");
    dispatch(syncTodos());
  };

  return (
    <Box display="flex" alignItems="center" m={1}>
      <Autocomplete
        id="asynchronous-demo"
        style={{ width: 300 }}
        open={open}
        inputValue={inputValue}
        value={value}
        onChange={(event: any, newValue: ISharedUser | null) => {
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onOpen={() => {
          setOpen(true);
          setLoading(true);
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
