"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Toolbar from "./Toolbar";
import TemplateModal from "./TemplateModal";

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

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <Toolbar
          editor={editor}
          onOpenTemplates={() => setTemplateOpen(true)}
        />
        <EditorContent editor={editor} />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>{wordCount} শব্দ</span>
        <button
          type="button"
          onClick={() => {
            if (!editor) return;
            const html = editor.getHTML();
            navigator.clipboard?.writeText(html);
            // eslint-disable-next-line no-console
            console.log(html);
          }}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          HTML কপি করুন
        </button>
      </div>

      <TemplateModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        onApply={applyTemplate}
      />
    </div>
  );
}
