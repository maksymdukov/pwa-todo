import React from "react";
import { Form, Field, FormikProps } from "formik";
import { Typography, LinearProgress, Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { FormValues } from "./signin";

export const SignInForm: React.FC<FormikProps<FormValues>> = ({
  submitForm,
  isSubmitting,
}) => {
  return (
    <Form noValidate>
      <Typography variant="h4" align="center" color="textSecondary">
        Sign in
      </Typography>
      <Field
        component={TextField}
        fullWidth
        variant="outlined"
        margin="normal"
        type="email"
        name="email"
        label="Email"
      />
      <Field
        component={TextField}
        fullWidth
        variant="outlined"
        margin="normal"
        type="password"
        name="password"
        label="Password"
      />
      {isSubmitting && <LinearProgress />}
      <Button
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        onClick={submitForm}
      >
        Submit
      </Button>
    </Form>
  );
};
