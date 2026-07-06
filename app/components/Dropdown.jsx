"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export function Dropdown({
  label,
  title,
  active,
  children,
  align = "left",
  panelClass = "",
  panelWidth = 180,
  showCaret = true,
  triggerClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, ready: false });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const update = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const width = panelRef.current?.offsetWidth || panelWidth;
      const height = panelRef.current?.offsetHeight || 0;
      let left = align === "right" ? rect.right - width : rect.left;
      const padding = 8;
      if (left + width > window.innerWidth - padding) {
        left = window.innerWidth - width - padding;
      }
      if (left < padding) left = padding;

      const spaceBelow = window.innerHeight - rect.bottom - padding;
      const spaceAbove = rect.top - padding;
      const gap = 6;
      let top;
      if (height && height > spaceBelow && spaceAbove > spaceBelow) {
        top = Math.max(padding, rect.top - gap - height);
      } else {
        top = rect.bottom + gap;
        const maxTop = window.innerHeight - padding - height;
        if (height && top > maxTop) top = Math.max(padding, maxTop);
      }
      setPos({ top, left, ready: true });
    };
    update();
    // Panel height is 0 on the first measure (not yet rendered with content),
    // so re-measure once after mount to get accurate flip-up positioning.
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, align, panelWidth]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={title}
        className={
          triggerClassName ||
          "inline-flex h-9 shrink-0 items-center gap-0.5 rounded-md border px-2 py-1.5 text-sm font-medium transition-colors sm:h-8 " +
            "hover:bg-zinc-100 dark:hover:bg-zinc-800 " +
            (active
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100")
        }
      >
        {label}
        {showCaret && (
          <ChevronDown
            className={
              "h-3.5 w-3.5 opacity-70 " +
              (triggerClassName ? "ml-1" : "")
            }
          />
        )}
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              visibility: pos.ready ? "visible" : "hidden",
              minWidth: panelWidth,
              maxHeight: "min(24rem, calc(100vh - 5rem))",
            }}
            onClick={() => setOpen(false)}
            className={
              "z-[100] overflow-y-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 " +
              panelClass
            }
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}

export function DropdownItem({
  onClick,
  active,
  disabled,
  icon: Icon,
  children,
  title,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={
        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors " +
        "disabled:cursor-not-allowed disabled:opacity-40 " +
        (active
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800")
      }
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}

export function DropdownLabel({ children }) {
  return (
    <div className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
      {children}
    </div>
  );
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-zinc-200 dark:bg-zinc-700" />;
}
