import { object, string, ref } from "yup";

export const signUpSchema = object().shape({
  email: string().required().email(),
  firstName: string().required().min(2),
  lastName: string().required().min(2),
  password: string().required().min(8),
  confirmPassword: string()
    .required()
    .oneOf([ref("password")], "Passwords should match"),
});
