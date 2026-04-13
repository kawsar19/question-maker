"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Download, Loader2, FileText, Columns2 } from "lucide-react";
import Toolbar from "./Toolbar";
import TemplateModal from "./TemplateModal";
import { Dropdown, DropdownItem, DropdownLabel } from "./Dropdown";

// Preserve inline `style` attribute on block nodes so template formatting
// (padding, margins, etc.) survives when content is loaded into the editor.
const StylePreserve = Extension.create({
  name: "stylePreserve",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "blockquote"],
        attributes: {
          style: {
            default: null,
            parseHTML: (el) => el.getAttribute("style"),
            renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
          },
        },
      },
      {
        types: ["orderedList", "bulletList"],
        attributes: {
          class: {
            default: null,
            parseHTML: (el) => el.getAttribute("class"),
            renderHTML: (attrs) => (attrs.class ? { class: attrs.class } : {}),
          },
        },
      },
      {
        // Preserve inline style on <span> (textStyle mark) so wrappers
        // used for flex layout etc. survive Tiptap's parse/render round-trip.
        types: ["textStyle"],
        attributes: {
          style: {
            default: null,
            parseHTML: (el) => el.getAttribute("style"),
            renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
          },
        },
      },
    ];
  },
});

const initialContent = `
  <h1>প্রশ্ন তৈরিতে স্বাগতম</h1>
  <p>এখানে লিখে নতুন প্রশ্ন তৈরি করুন, অথবা উপরের <strong>"টেমপ্লেট"</strong> বোতাম থেকে প্রি-মেইড প্রশ্ন টেমপ্লেট বেছে নিন।</p>
  <ul>
    <li>Next.js + Tailwind দিয়ে তৈরি</li>
    <li>রিচ টেক্সট এডিটর: Tiptap v3</li>
    <li>শ্রেণি অনুযায়ী বাংলা প্রশ্নের টেমপ্লেট</li>
  </ul>
`;

export default function Editor() {
  const [wordCount, setWordCount] = useState(0);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      StylePreserve,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline underline-offset-2",
        },
      }),
      Placeholder.configure({
        placeholder: "এখানে প্রশ্ন লিখুন…",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-zinc dark:prose-invert max-w-none min-h-[360px] focus:outline-none px-5 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText().trim();
      setWordCount(text ? text.split(/\s+/).length : 0);
    },
  });

  const applyTemplate = (html) => {
    if (!editor) return;
    editor.commands.setContent(html);
    const text = editor.getText().trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    editor.commands.focus("end");
  };

  const insertBlock = (html) => {
    if (!editor) return;
    editor.chain().focus().insertContent(html).run();
  };

  const downloadPdf = async (layout = "single") => {
    if (!editor || printing) return;
    setPrinting(true);
    setPrintError(null);
    try {
      const html = editor.getHTML();
      const title =
        (editor.getText().trim().split(/\s+/).slice(0, 8).join(" ") || "").slice(
          0,
          60,
        ) || "প্রশ্নপত্র";
      const res = await fetch("/api/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, title, layout }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `PDF generation failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const suffix = layout === "duplicate-2up" ? "-2up" : "";
      a.download = `${title}${suffix}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setPrintError(err?.message ?? "PDF তৈরি করা যায়নি");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <Toolbar
          editor={editor}
          onOpenTemplates={() => setTemplateOpen(true)}
          onInsertBlock={insertBlock}
        />
        <EditorContent editor={editor} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{wordCount} শব্দ</span>
        <div className="flex items-center gap-2">
          {printError && (
            <span className="text-xs text-red-600 dark:text-red-400">
              {printError}
            </span>
          )}
          <Dropdown
            align="right"
            panelWidth={260}
            label={
              <span className="inline-flex items-center gap-1.5">
                {printing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{printing ? "তৈরি হচ্ছে…" : "PDF ডাউনলোড"}</span>
              </span>
            }
            triggerClassName="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <DropdownLabel>লেআউট বেছে নিন</DropdownLabel>
            <DropdownItem
              icon={FileText}
              onClick={() => downloadPdf("single")}
              disabled={printing}
            >
              <div>
                <div className="font-medium">A4 পোর্ট্রেট (একক কপি)</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  সাধারণ প্রশ্নপত্র
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              icon={Columns2}
              onClick={() => downloadPdf("duplicate-2up")}
              disabled={printing}
            >
              <div>
                <div className="font-medium">
                  A4 ল্যান্ডস্কেপ — ২ কপি পাশাপাশি
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  প্রিন্টের পর মাঝ বরাবর কেটে ২টি প্রশ্নপত্র
                </div>
              </div>
            </DropdownItem>
          </Dropdown>
          <button
            type="button"
            onClick={() => {
              if (!editor) return;
              const html = editor.getHTML();
              navigator.clipboard?.writeText(html);
            }}
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            HTML কপি
          </button>
        </div>
      </div>

      <TemplateModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onApply={applyTemplate}
      />
    </div>
  );
}
