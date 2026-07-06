"use client";

import { useEffect, useState } from "react";
import { categories } from "../templates";

export default function TemplateModal({ open, onClose, onApply }) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
  const [activeTemplateId, setActiveTemplateId] = useState(
    categories[0].templates[0].id,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const category =
    categories.find((c) => c.id === activeCategoryId) ?? categories[0];
  const template =
    category.templates.find((t) => t.id === activeTemplateId) ??
    category.templates[0];

  const selectCategory = (id) => {
    const next = categories.find((c) => c.id === id);
    setActiveCategoryId(id);
    setActiveTemplateId(next.templates[0].id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[88vh] sm:max-w-6xl sm:rounded-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 sm:px-5 sm:py-3 dark:border-zinc-700">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-50">
              প্রশ্নের টেমপ্লেট
            </h2>
            <p className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
              শ্রেণি অনুযায়ী প্রি-মেইড প্রশ্ন টেমপ্লেট — একটি বেছে নিয়ে এডিটরে লোড করুন
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-zinc-200 bg-zinc-50 px-3 py-2 scrollbar-hide sm:px-5 dark:border-zinc-700 dark:bg-zinc-900/60">
          {categories.map((c) => {
            const active = c.id === activeCategoryId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={
                  "flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors " +
                  (active
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800")
                }
              >
                <span>{c.name}</span>
                <span
                  className={
                    "rounded px-1.5 py-0.5 text-xs " +
                    (active
                      ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400")
                  }
                >
                  {c.templates.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body: list + preview */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Template list */}
          <div className="max-h-40 w-full shrink-0 overflow-y-auto border-b border-zinc-200 p-2.5 sm:max-h-none sm:p-3 dark:border-zinc-700 md:h-auto md:w-72 md:border-b-0 md:border-r">
            <ul className="flex flex-col gap-1.5">
              {category.templates.map((t) => {
                const active = t.id === activeTemplateId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTemplateId(t.id)}
                      className={
                        "w-full rounded-lg border px-3 py-2.5 text-left transition-colors " +
                        (active
                          ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800")
                      }
                    >
                      <div
                        className={
                          "text-sm font-medium " +
                          (active
                            ? "text-blue-900 dark:text-blue-100"
                            : "text-zinc-900 dark:text-zinc-100")
                        }
                      >
                        {t.title}
                      </div>
                      <div
                        className={
                          "mt-0.5 text-xs " +
                          (active
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-zinc-500 dark:text-zinc-400")
                        }
                      >
                        {t.subject}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Preview */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-3 dark:border-zinc-700 dark:bg-zinc-900/60">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {template.title}
                </div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {category.name} • {template.subject}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onApply(template.html);
                  onClose();
                }}
                className="w-full shrink-0 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto sm:py-2"
              >
                এই টেমপ্লেটটি ব্যবহার করুন
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto bg-white px-4 py-4 sm:px-6 sm:py-5 dark:bg-zinc-900">
              <div
                className="tiptap"
                dangerouslySetInnerHTML={{ __html: template.html }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
