"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Plus, ChevronDown } from "lucide-react";
import { blockCategories } from "../blocks";

export default function BlockInsertDropdown({ onInsert }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, ready: false });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const update = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const width = panelRef.current?.offsetWidth || 320;
      const padding = 8;
      let left = rect.left;
      if (left + width > window.innerWidth - padding) {
        left = window.innerWidth - width - padding;
      }
      if (left < padding) left = padding;
      setPos({ top: rect.bottom + 6, left, ready: true });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

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
        title="প্রশ্ন ব্লক ইনসার্ট করুন"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-violet-600 bg-violet-600 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-700"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">ব্লক</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
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
              width: "min(20rem, calc(100vw - 1rem))",
              maxHeight: "min(28rem, calc(100vh - 5rem))",
            }}
            className="z-[100] overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            {blockCategories.map((cat) => (
              <div
                key={cat.id}
                className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
              >
                <div className="sticky top-0 bg-zinc-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300">
                  {cat.name}
                </div>
                <ul>
                  {cat.blocks.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onInsert(b.html);
                          setOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/40"
                      >
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {b.label}
                        </div>
                        {b.description && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {b.description}
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
