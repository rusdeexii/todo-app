import React, { useState, useEffect } from "react";
import { Plus, Edit3, X } from "lucide-react";
import type { Todo } from "../features/todos/types";

interface Props {
  onSave: (todoText: string) => void;
  editingTodo?: Todo | null;
  onCancelEdit?: () => void;
}

const TodoForm: React.FC<Props> = ({ onSave, editingTodo, onCancelEdit }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(editingTodo);
  const trimmedText = text.trim();

  useEffect(() => {
    setText(editingTodo?.todo ?? "");
  }, [editingTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 200));
    onSave(trimmedText);
    setText("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isEditing ? "Update your todo..." : "What needs to be done?"}
          disabled={isSubmitting}
          autoFocus
          className="w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isEditing ? <Edit3 size={20} /> : <Plus size={20} />}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={16} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!trimmedText || isSubmitting}
          className="flex items-center gap-2 px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isEditing ? (
            <Edit3 size={16} />
          ) : (
            <Plus size={16} />
          )}
          {isSubmitting ? "Processing..." : isEditing ? "Update" : "Add Todo"}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
