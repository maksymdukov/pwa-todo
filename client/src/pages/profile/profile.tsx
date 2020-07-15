import React, { useEffect } from "react";
import { Typography, LinearProgress } from "@material-ui/core";
import { Formik, FormikHelpers } from "formik";
import { ProfileForm } from "./profile-form";
import { useSelector, useDispatch } from "react-redux";
import { getUserState } from "store/user/selectors";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteAccount } from "pages/profile/components/delete-account/delete-account";
import { getConnetionStatus } from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";
import OfflineLabel from "components/typography/offline";
import SocialLinking from "./components/social-linking/social-linking";
import { fetchProfile } from "store/user/actions";
import { PasswordForm } from "./password-form";
import { object, string, ref } from "yup";
import { usersService } from "services/users.service";

const useStyles = makeStyles(() => ({
  form: {
    maxWidth: 500,
    margin: "auto",
  },
}));

export interface ProfileFormValues {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface PasswordFormValues {
  password: string;
  confirmPassword: string;
}

const profileValidationScheme = object().shape({
  firstName: string().required().min(3),
  lastName: string().required().min(3),
});
const passwordValidationScheme = object().shape({
  password: string().required().min(8),
  confirmPassword: string()
    .required()
    .oneOf([ref("password")], "Passwords should match"),
});

export const Profile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(getUserState);
  const connectionStatus = useSelector(getConnetionStatus);

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.online) {
      dispatch(fetchProfile());
    }
  }, [dispatch, connectionStatus]);

  const handleProfileSubmit = async (
    values: ProfileFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ProfileFormValues>
  ) => {
    try {
      await usersService.saveProfile({
        firstName: values.firstName,
        lastName: values.lastName,
      });
      setSubmitting(false);
      dispatch(fetchProfile());
    } catch (error) {
      setSubmitting(false);
      console.error(error);
      if (error.response?.data?.errors) {
        setErrors(
          error.response?.data?.errors.reduce(
            (acc: any, err: { field: string; message: string }) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          )
        );
      }
    }
  };

  const handlePasswordSubmit = async (
    values: PasswordFormValues,
    { setSubmitting, setErrors }: FormikHelpers<PasswordFormValues>
  ) => {
    try {
      await usersService.changePassword({ newPassword: values.password });
      setSubmitting(false);
      dispatch(fetchProfile());
    } catch (error) {
      setSubmitting(false);
      console.error(error);
      if (error.response?.data?.errors) {
        setErrors(
          error.response?.data?.errors.reduce(
            (acc: any, err: { field: string; message: string }) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          )
        );
      }
    }
  };

  if (connectionStatus === ConnectionStatus.offline) {
    return <OfflineLabel />;
  }

  if (user.profileLoading) {
    return <LinearProgress />;
  }

  const initialProfileValues: ProfileFormValues = {
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    picture: user.picture || "",
  };

  const initialPasswordValues: PasswordFormValues = {
    password: "",
    confirmPassword: "",
  };
  return (
    <section>
      <Typography variant="h3" color="textSecondary" align="center">
        Profile
      </Typography>
      <section className={classes.form}>
        <Formik
          onSubmit={handleProfileSubmit}
          validationSchema={profileValidationScheme}
          initialValues={initialProfileValues}
          enableReinitialize
          component={ProfileForm}
        />
        <Formik
          onSubmit={handlePasswordSubmit}
          validationSchema={passwordValidationScheme}
          initialValues={initialPasswordValues}
          enableReinitialize
          component={PasswordForm}
        />
        <SocialLinking />
        <DeleteAccount />
      </section>
    </section>
  );
};
