import React from "react";
import { Form, Field, FormikProps } from "formik";
import { LinearProgress, Button } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { FormValues } from "./signup";

export const SignUpForm: React.FC<FormikProps<FormValues>> = ({
  submitForm,
  isSubmitting,
}) => {
  return (
    <Form noValidate>
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
        name="firstName"
        label="First Name"
      />
      <Field
        component={TextField}
        fullWidth
        variant="outlined"
        margin="normal"
        name="lastName"
        label="Last Name"
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
      <Field
        component={TextField}
        fullWidth
        variant="outlined"
        margin="normal"
        type="password"
        name="confirmPassword"
        label="Confirm Password"
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
