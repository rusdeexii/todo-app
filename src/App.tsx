import React, { useState } from "react";
import { Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { useTodos } from "./features/todos/useTodos";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import Modal from "./components/Modal";
import type { Todo } from "./features/todos/types";

const App: React.FC = () => {
  const { todos, loading, error, addTodo, deleteTodo, toggleTodo, updateTodo } = useTodos();

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (todo: Todo | null = null) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleSave = (text: string) => {
    if (editingTodo) updateTodo({ ...editingTodo, todo: text });
    else addTodo({ id: Date.now(), todo: text, completed: false, userId: 0 });

    setModalOpen(false);
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Todo Master <Sparkles size={20} className="text-yellow-500" />
              </h1>
              <p className="text-sm text-gray-600">
                {totalCount > 0
                  ? `${completedCount} of ${totalCount} tasks completed`
                  : "Start organizing your day"}
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-transform duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            onClick={() => openModal()}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Todo</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading your todos...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <p className="text-red-700 font-medium">Something went wrong</p>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={openModal}
            />
          </div>
        )}
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTodo ? "Edit Todo" : "Create New Todo"}
      >
        <TodoForm
          onSave={handleSave}
          editingTodo={editingTodo}
          onCancelEdit={() => setModalOpen(false)}
        />
      </Modal>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default App;
