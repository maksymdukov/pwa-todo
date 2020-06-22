import React from "react";
import { Typography } from "@material-ui/core";
import { Formik } from "formik";
import { ProfileForm } from "./form";
import { useSelector } from "react-redux";
import { getUserState } from "store/user/selectors";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteAccount } from "pages/profile/components/delete-account/delete-account";

const useStyles = makeStyles(() => ({
  form: {
    maxWidth: 500,
    margin: "auto"
  }
}));

export interface ProfileFormValues {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  password: string;
  confirmPassword: string;
}

export const Profile = () => {
  const classes = useStyles();
  const user = useSelector(getUserState);
  const initialValues: ProfileFormValues = {
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    picture: user.picture || "",
    password: "",
    confirmPassword: ""
  };
  return (
    <section>
      <Typography variant="h3" color="textSecondary" align="center">
        Profile
      </Typography>
      <section className={classes.form}>
        <Formik
          onSubmit={() => {}}
          initialValues={initialValues}
          enableReinitialize
          component={ProfileForm}
        />
        <DeleteAccount />
      </section>
    </section>
  );
};
