import React from "react";
import { Form, Field, FormikProps } from "formik";
import { TextField } from "formik-material-ui";
import { LinearProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { PasswordFormValues } from "./profile";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
}));

export const PasswordForm: React.FC<FormikProps<PasswordFormValues>> = ({
  isSubmitting,
  submitForm,
  dirty,
}) => {
  const classes = useStyles();
  return (
    <Form className={classes.form}>
      <Field
        fullWidth
        component={TextField}
        variant="outlined"
        name="password"
        type="password"
        label="Password"
      />
      <Field
        fullWidth
        component={TextField}
        variant="outlined"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
      />
      {isSubmitting && <LinearProgress />}
      <Button
        onClick={submitForm}
        disabled={!dirty}
        variant="contained"
        color="primary"
      >
        Change
      </Button>
    </Form>
  );
};
