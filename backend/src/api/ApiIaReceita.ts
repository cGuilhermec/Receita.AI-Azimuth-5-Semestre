import axios, { AxiosInstance } from "axios";

const apiIaReceita: AxiosInstance = axios.create({
  baseURL: "http://localhost:11434/api",
});

export default apiIaReceita;
