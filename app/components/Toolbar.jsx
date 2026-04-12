"use client";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListChecks,
  IndentIncrease,
  IndentDecrease,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Link2Off,
  Minus,
  CornerDownLeft,
  Undo,
  Redo,
  Eraser,
  FileText,
  MoreHorizontal,
  Languages,
} from "lucide-react";
import BlockInsertDropdown from "./BlockInsertDropdown";
import {
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "./Dropdown";

function IconBtn({ onClick, active, disabled, title, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors " +
        "disabled:cursor-not-allowed disabled:opacity-40 " +
        "hover:bg-zinc-100 dark:hover:bg-zinc-800 " +
        (active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200")
      }
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return (
    <span className="mx-0.5 h-6 w-px shrink-0 bg-zinc-200 dark:bg-zinc-700" />
  );
}

export default function Toolbar({ editor, onOpenTemplates, onInsertBlock }) {
  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("URL লিখুন", previous ?? "https://");
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

  const headingActive =
    (editor.isActive("heading", { level: 1 }) && "h1") ||
    (editor.isActive("heading", { level: 2 }) && "h2") ||
    (editor.isActive("heading", { level: 3 }) && "h3") ||
    "p";

  const HeadingIcon =
    headingActive === "h1"
      ? Heading1
      : headingActive === "h2"
        ? Heading2
        : headingActive === "h3"
          ? Heading3
          : Pilcrow;

  const currentAlign =
    (editor.isActive({ textAlign: "center" }) && "center") ||
    (editor.isActive({ textAlign: "right" }) && "right") ||
    "left";

  const AlignIcon =
    currentAlign === "center"
      ? AlignCenter
      : currentAlign === "right"
        ? AlignRight
        : AlignLeft;

  return (
    <div className="sticky top-0 z-20 flex items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-zinc-50/95 p-1.5 backdrop-blur scrollbar-hide dark:border-zinc-700 dark:bg-zinc-900/85">
      {/* Primary: Templates + Blocks */}
      {onOpenTemplates && (
        <button
          type="button"
          onClick={onOpenTemplates}
          title="প্রি-মেইড প্রশ্ন টেমপ্লেট"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-blue-600 bg-blue-600 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">টেমপ্লেট</span>
        </button>
      )}
      {onInsertBlock && <BlockInsertDropdown onInsert={onInsertBlock} />}
      {(onOpenTemplates || onInsertBlock) && <Divider />}

      {/* Heading */}
      <Dropdown
        title="Heading"
        label={<HeadingIcon className="h-4 w-4" />}
        active={headingActive !== "p"}
      >
        <DropdownItem
          icon={Heading1}
          active={headingActive === "h1"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          Heading 1
        </DropdownItem>
        <DropdownItem
          icon={Heading2}
          active={headingActive === "h2"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Heading 2
        </DropdownItem>
        <DropdownItem
          icon={Heading3}
          active={headingActive === "h3"}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          Heading 3
        </DropdownItem>
        <DropdownItem
          icon={Pilcrow}
          active={headingActive === "p"}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </DropdownItem>
      </Dropdown>

      {/* Bold / Italic */}
      <IconBtn
        icon={Bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold (Ctrl/⌘+B)"
      />
      <IconBtn
        icon={Italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic (Ctrl/⌘+I)"
      />

      <Divider />

      {/* Lists (including Bangla) */}
      <Dropdown
        title="List"
        label={
          <span className="inline-flex items-center gap-1">
            {listClass === "bn-digits-list" ? (
              <span className="text-sm font-semibold">১।</span>
            ) : listClass === "bn-letters-list" ? (
              <span className="text-sm font-semibold">ক)</span>
            ) : editor.isActive("bulletList") ? (
              <List className="h-4 w-4" />
            ) : editor.isActive("orderedList") ? (
              <ListOrdered className="h-4 w-4" />
            ) : (
              <ListChecks className="h-4 w-4" />
            )}
          </span>
        }
        active={
          editor.isActive("bulletList") ||
          editor.isActive("orderedList")
        }
      >
        <DropdownLabel>ইংরেজি</DropdownLabel>
        <DropdownItem
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </DropdownItem>
        <DropdownItem
          icon={ListOrdered}
          active={editor.isActive("orderedList") && !listClass}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered (1. 2. 3.)
        </DropdownItem>
        <DropdownDivider />
        <DropdownLabel>বাংলা</DropdownLabel>
        <DropdownItem
          icon={Languages}
          active={listClass === "bn-digits-list"}
          onClick={() => toggleOrderedListClass("bn-digits-list")}
        >
          ১। ২। ৩। তালিকা
        </DropdownItem>
        <DropdownItem
          icon={Languages}
          active={listClass === "bn-letters-list"}
          onClick={() => toggleOrderedListClass("bn-letters-list")}
        >
          ক) খ) গ) তালিকা
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          icon={IndentIncrease}
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          disabled={!editor.can().sinkListItem("listItem")}
          title="Tab"
        >
          Indent (নেস্ট)
        </DropdownItem>
        <DropdownItem
          icon={IndentDecrease}
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          disabled={!editor.can().liftListItem("listItem")}
          title="Shift+Tab"
        >
          Outdent (বাইরে)
        </DropdownItem>
      </Dropdown>

      {/* Alignment */}
      <Dropdown
        title="Align"
        label={<AlignIcon className="h-4 w-4" />}
        active={currentAlign !== "left"}
      >
        <DropdownItem
          icon={AlignLeft}
          active={currentAlign === "left"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Align left
        </DropdownItem>
        <DropdownItem
          icon={AlignCenter}
          active={currentAlign === "center"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Align center
        </DropdownItem>
        <DropdownItem
          icon={AlignRight}
          active={currentAlign === "right"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Align right
        </DropdownItem>
      </Dropdown>

      <Divider />

      {/* Insert */}
      <IconBtn
        icon={LinkIcon}
        onClick={setLink}
        active={editor.isActive("link")}
        title="Link"
      />
      <IconBtn
        icon={Quote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      />

      {/* More (overflow) */}
      <Dropdown title="More" label={<MoreHorizontal className="h-4 w-4" />}>
        <DropdownItem
          icon={Strikethrough}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strikethrough
        </DropdownItem>
        <DropdownItem
          icon={Code}
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          Inline code
        </DropdownItem>
        <DropdownItem
          icon={Code2}
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code block
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          icon={Minus}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </DropdownItem>
        <DropdownItem
          icon={CornerDownLeft}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard break
        </DropdownItem>
        <DropdownItem
          icon={Link2Off}
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Remove link
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem
          icon={Eraser}
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          Clear formatting
        </DropdownItem>
      </Dropdown>

      <Divider />

      {/* History */}
      <IconBtn
        icon={Undo}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl/⌘+Z)"
      />
      <IconBtn
        icon={Redo}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl/⌘+Shift+Z)"
      />
    </div>
  );
}
