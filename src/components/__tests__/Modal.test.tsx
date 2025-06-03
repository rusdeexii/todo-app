import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";

describe("Modal", () => {
  it("ไม่แสดง modal เมื่อ isOpen = false", () => {
    const { container } = render(<Modal isOpen={false} onClose={() => {}}>Content</Modal>);
    expect(container.firstChild).toBeNull();
  });

  it("แสดง title และ children เมื่อ isOpen = true", () => {
    render(
      <Modal isOpen={true} title="Modal Title" onClose={() => {}}>
        Modal Content
      </Modal>
    );
    expect(screen.getByText("Modal Title")).toBeDefined();
    expect(screen.getByText("Modal Content")).toBeDefined();
  });

  it("เรียก onClose เมื่อคลิกปิด modal หรือ overlay", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} title="Modal Title" onClose={onClose}>
        Content
      </Modal>
    );

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockReset();
    const closeBtn = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ซ่อน scroll ของ body เมื่อเปิด modal และคืนค่าหลังปิด", () => {
    const { unmount } = render(
      <Modal isOpen={true} title="Title" onClose={() => {}}>
        Content
      </Modal>
    );
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("unset");
  });
});
