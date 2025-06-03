import axios from "axios";
import type { Todo } from ".././features/todos/types";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get("/todos?limit=10");
  return response.data.todos;
};
