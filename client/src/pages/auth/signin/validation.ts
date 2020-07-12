import { object, string } from "yup";

export const singinValidationSchema = object().shape({
  email: string().required().email(),
  password: string().required().min(8),
});
