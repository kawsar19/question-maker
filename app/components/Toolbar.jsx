"use client";

function Button({ onClick, active, disabled, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={
        "rounded-md border border-zinc-200 px-2.5 py-1 text-sm font-medium transition-colors " +
        "hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 " +
        "dark:border-zinc-700 dark:hover:bg-zinc-800 " +
        (active
          ? "bg-zinc-900 text-white hover:bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-100"
          : "bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100")
      }
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />;
}

export default function Toolbar({ editor, onOpenTemplates }) {
  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const toggleOrderedListClass = (className) => {
    const inList = editor.isActive("orderedList");
    const current = inList ? editor.getAttributes("orderedList").class : null;
    if (inList && current === className) {
      editor.chain().focus().toggleOrderedList().run();
    } else if (inList) {
      editor
        .chain()
        .focus()
        .updateAttributes("orderedList", { class: className })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .toggleOrderedList()
        .updateAttributes("orderedList", { class: className })
        .run();
    }
  };

  const listClass = editor.isActive("orderedList")
    ? editor.getAttributes("orderedList").class
    : null;

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-900/60">
      {onOpenTemplates && (
        <>
          <button
            type="button"
            onClick={onOpenTemplates}
            title="প্রি-মেইড প্রশ্ন টেমপ্লেট"
            className="rounded-md border border-blue-600 bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            📋 টেমপ্লেট
          </button>
          <Divider />
        </>
      )}
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <strong>B</strong>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <em>I</em>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <s>S</s>
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline code"
      >
        {"</>"}
      </Button>

      <Divider />

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        H1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </Button>
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive("paragraph")}
        title="Paragraph"
      >
        P
      </Button>

      <Divider />

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        • List
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList") && !listClass}
        title="Ordered list (1. 2. 3.)"
      >
        1. List
      </Button>
      <Button
        onClick={() =>
          editor.chain().focus().sinkListItem("listItem").run()
        }
        disabled={!editor.can().sinkListItem("listItem")}
        title="Indent / নেস্ট (Tab) — নির্বাচিত list item-গুলো আরও ভিতরে"
      >
        ⇥
      </Button>
      <Button
        onClick={() =>
          editor.chain().focus().liftListItem("listItem").run()
        }
        disabled={!editor.can().liftListItem("listItem")}
        title="Outdent / বাইরে (Shift+Tab)"
      >
        ⇤
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        “ ”
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        {"{ }"}
      </Button>

      <Divider />

      <Button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        ⯇
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align center"
      >
        ≡
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        ⯈
      </Button>

      <Divider />

      <Button onClick={setLink} active={editor.isActive("link")} title="Link">
        🔗
      </Button>
      <Button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Remove link"
      >
        ⛔
      </Button>

      <Divider />

      <Button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        ―
      </Button>
      <Button
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title="Hard break"
      >
        ↵
      </Button>

      <Divider />

      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        ↶
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        ↷
      </Button>

      <Divider />

      <Button
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear formatting"
      >
        Clear
      </Button>

      <Divider />

      {/* Bangla formatting group */}
      <div className="flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 dark:border-emerald-800 dark:bg-emerald-950/40">
        <span className="px-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
          বাংলা
        </span>
        <Button
          onClick={() => toggleOrderedListClass("bn-digits-list")}
          active={listClass === "bn-digits-list"}
          title="বাংলা সংখ্যা তালিকা (১। ২। ৩।)"
        >
          ১। তালিকা
        </Button>
        <Button
          onClick={() => toggleOrderedListClass("bn-letters-list")}
          active={listClass === "bn-letters-list"}
          title="বাংলা অক্ষর তালিকা (ক) খ) গ) ঘ))"
        >
          ক) তালিকা
        </Button>
      </div>
    </div>
  );
}
