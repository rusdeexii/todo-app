import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoList from "../TodoList";
import type { Todo } from "../../features/todos/types";

const todos: Todo[] = [
  { id: 1, todo: "Task 1", completed: false, userId: 1 },
  { id: 2, todo: "Task 2", completed: true, userId: 1 },
  { id: 3, todo: "Another Task", completed: false, userId: 2 },
];

describe("TodoList", () => {
  const onToggle = vi.fn();
  const onDelete = vi.fn();
  const onEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("แสดงข้อความเมื่อไม่มี todos", () => {
    render(<TodoList todos={[]} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText(/no todos yet/i)).toBeDefined();
  });

  it("แสดง todos ทั้งหมด", () => {
    render(<TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    todos.forEach((todo) => {
      expect(screen.getByText(todo.todo)).toBeDefined();
    });
  });

  it("กรอง todos ตามคำค้นหา", () => {
    render(<TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const searchInput = screen.getByPlaceholderText(/search todos/i);
    fireEvent.change(searchInput, { target: { value: "another" } });
    expect(screen.getByText("Another Task")).toBeDefined();
    expect(screen.queryByText("Task 1")).toBeNull();
  });

  it("กรอง todos ตาม filter 'Active' และ 'Done'", () => {
    render(<TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole("button", { name: /active/i }));
    expect(screen.getByText("Task 1")).toBeDefined();
    expect(screen.queryByText("Task 2")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /done/i }));
    expect(screen.getByText("Task 2")).toBeDefined();
    expect(screen.queryByText("Task 1")).toBeNull();
  });

  it("เรียก callback onToggle, onDelete, onEdit จาก TodoItem", async () => {
    render(<TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    
    const toggleBtns = screen.getAllByRole("button", { name: /toggle/i });
    fireEvent.click(toggleBtns[0]);
    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith(todos[0].id);
    });

    const editBtns = screen.getAllByRole("button", { name: /edit todo/i });
    fireEvent.click(editBtns[0]);
    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith(todos[0]);
    });

    const deleteBtns = screen.getAllByRole("button", { name: /delete todo/i });
    fireEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(todos[0].id);
    });
  });
});
