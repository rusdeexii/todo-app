import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoItem from "../TodoItem";
import type { Todo } from "../../features/todos/types";

const todo: Todo = { id: 1, todo: "Sample Task", completed: false, userId: 1 };

describe("TodoItem", () => {
  const onToggle = vi.fn();
  const onDelete = vi.fn();
  const onEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("แสดงข้อความ todo", () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    expect(screen.getByText(todo.todo)).toBeDefined();
  });

  it("เรียก onToggle เมื่อกดปุ่ม toggle", async () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const toggleBtn = screen.getByRole("button", { name: /toggle/i });
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith(todo.id);
    });
  });

  it("เรียก onDelete เมื่อกดปุ่ม delete", async () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const deleteBtn = screen.getByRole("button", { name: /delete todo/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(todo.id);
    });
  });

  it("เรียก onEdit เมื่อกดปุ่ม edit", () => {
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />);
    const editBtn = screen.getByRole("button", { name: /edit todo/i });
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledWith(todo);
  });
});
