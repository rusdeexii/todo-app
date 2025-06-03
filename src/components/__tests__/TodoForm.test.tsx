import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoForm from "../TodoForm";
import type { Todo } from "../../features/todos/types";

describe("TodoForm", () => {
  it("renders empty input when adding a new todo", () => {
    render(<TodoForm onSave={() => {}} editingTodo={null} onCancelEdit={() => {}} />);
    const input = screen.getByPlaceholderText(/what needs to be done/i);
    expect(input).toHaveValue("");
  });

  it("renders input with value when editing a todo", () => {
    const todo: Todo = {
      id: 1,
      todo: "Existing task",
      completed: false,
      userId: 1,
    };

    render(<TodoForm onSave={() => {}} editingTodo={todo} onCancelEdit={() => {}} />);
    const input = screen.getByDisplayValue("Existing task");
    expect(input).toBeInTheDocument();
  });

  it("calls onSave with input value on submit (add mode)", async () => {
    const onSave = vi.fn();
    render(<TodoForm onSave={onSave} editingTodo={null} onCancelEdit={() => {}} />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const button = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("New Task");
    });
  });

  it("calls onSave with updated value on submit (edit mode)", async () => {
    const todo: Todo = {
      id: 1,
      todo: "Edit me",
      completed: false,
      userId: 1,
    };

    const onSave = vi.fn();
    render(<TodoForm onSave={onSave} editingTodo={todo} onCancelEdit={() => {}} />);

    const input = screen.getByDisplayValue("Edit me");
    const button = screen.getByRole("button", { name: /update/i });

    fireEvent.change(input, { target: { value: "Updated Task" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("Updated Task");
    });
  });

  it("calls onCancelEdit when cancel is clicked during edit", () => {
    const todo: Todo = {
      id: 2,
      todo: "Edit me",
      completed: false,
      userId: 2,
    };

    const onCancelEdit = vi.fn();

    render(
      <TodoForm
        onSave={() => {}}
        editingTodo={todo}
        onCancelEdit={onCancelEdit}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(onCancelEdit).toHaveBeenCalled();
  });

  it("disables submit button while submitting", async () => {
    const onSave = vi.fn();
    render(<TodoForm onSave={onSave} editingTodo={null} onCancelEdit={() => {}} />);

    const input = screen.getByPlaceholderText(/what needs to be done/i);
    const button = screen.getByRole("button", { name: /add todo/i });

    fireEvent.change(input, { target: { value: "Submitting task" } });
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });

  it("does not call onSave if input is empty", async () => {
    const onSave = vi.fn();
    render(<TodoForm onSave={onSave} editingTodo={null} onCancelEdit={() => {}} />);

    const button = screen.getByRole("button", { name: /add todo/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSave).not.toHaveBeenCalled();
    });
  });
});
