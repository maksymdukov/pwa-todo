import { default as Axios } from "axios";

export const axios = Axios.create({
  timeout: 5000,
});
