import React, { useState } from "react";
import { Search, Filter, CheckCircle2, Circle, List } from "lucide-react";
import TodoItem from "./TodoItem";
import type { Todo } from "../features/todos/types";

interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: Todo) => void;
}

type FilterType = "all" | "active" | "completed";

const FILTER_OPTIONS: { key: FilterType; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: List },
  { key: "active", label: "Active", icon: Circle },
  { key: "completed", label: "Done", icon: CheckCircle2 },
];

const TodoList: React.FC<Props> = ({ todos, onToggle, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const filteredTodos = todos.filter(({ todo, completed }) => {
    const matchesSearch = todo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && completed) ||
      (filter === "active" && !completed);
    return matchesSearch && matchesFilter;
  });

  if (totalCount === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <List size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
        <p className="text-gray-500">Create your first todo to get started!</p>
      </div>
    );
  }

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          {FILTER_OPTIONS.map(({ key, label, icon: Icon }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">{completedCount}</span> of{" "}
          <span className="font-medium">{totalCount}</span> completed
        </div>

        <div className="flex-1 max-w-32 ml-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-8">
          <Filter size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No todos match your current filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-in fade-in slide-in-from-bottom-2"
            >
              <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
