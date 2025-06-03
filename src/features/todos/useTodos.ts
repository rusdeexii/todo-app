// src/features/todos/useTodos.ts
import { useEffect, useState } from "react";
import { getTodos } from "../../api/todoApi";
import type { Todo } from "./types";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        setError("Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = (newTodo: Todo) => setTodos(prev => [...prev, newTodo]);

  const updateTodo = (updated: Todo) =>
    setTodos(prev =>
      prev.map(todo => (todo.id === updated.id ? updated : todo))
    );

  const deleteTodo = (id: number) =>
    setTodos(prev => prev.filter(todo => todo.id !== id));

  const toggleTodo = (id: number) =>
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
}
