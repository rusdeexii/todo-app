import React, { useState } from "react";
import { Edit3, Trash2, Check } from "lucide-react";
import type { Todo } from "../features/todos/types";

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    await new Promise((res) => setTimeout(res, 150));
    onToggle(todo.id);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await new Promise((res) => setTimeout(res, 200));
    onDelete(todo.id);
  };

  const containerClasses = [
    "group relative p-4 rounded-xl border shadow-sm bg-white transition-all duration-300",
    "hover:shadow-md hover:-translate-y-0.5",
    todo.completed && "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
    isDeleting && "opacity-50 scale-95",
  ]
    .filter(Boolean)
    .join(" ");

  const toggleButtonClasses = [
    "flex items-center justify-center w-6 h-6 rounded-full border-2 transition duration-200",
    todo.completed
      ? "bg-green-500 border-green-500 text-white"
      : "border-gray-300 hover:border-green-400 hover:bg-green-50",
    isToggling && "animate-pulse",
  ]
    .filter(Boolean)
    .join(" ");

  const todoTextClasses = [
    "block text-gray-900 transition duration-200",
    todo.completed && "line-through text-gray-500",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={toggleButtonClasses}
          aria-label="toggle todo"  
        >
          {todo.completed && <Check size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <span className={todoTextClasses}>{todo.todo}</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(todo)}
            title="Edit todo"
            aria-label="edit todo"
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete todo"
            aria-label="delete todo"
            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {todo.completed && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default TodoItem;
