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
  Type,
  ALargeSmall,
  Rows3,
  Circle as CircleIcon,
  Columns2 as Columns2Icon,
  LayoutGrid,
  AlignVerticalSpaceAround,
  Group as GroupIcon,
  Ungroup as UngroupIcon,
  Table as TableIcon,
  Grid3x3,
  RowsIcon,
  Columns3,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Heading as HeadingRowIcon,
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
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors sm:h-8 sm:w-8 " +
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

  const FORMAT_CLASSES = new Set([
    "bn-digits-list",
    "bn-letters-list",
    "en-letters-list",
    "bn-digits-circle-list",
    "bn-letters-circle-list",
    "en-digits-circle-list",
    "en-letters-circle-list",
    "bangla-list",
  ]);

  const rawListClass = editor.isActive("orderedList")
    ? editor.getAttributes("orderedList").class || ""
    : "";
  const listClassParts = rawListClass.split(/\s+/).filter(Boolean);
  const listFormatClass =
    listClassParts.find((c) => FORMAT_CLASSES.has(c)) || null;
  const listLayoutClass =
    listClassParts.find((c) => /^mcq-grid-\d+$/.test(c)) || null;
  // Keep back-compat: the existing `listClass` variable now reflects the
  // numbering-format portion only.
  const listClass = listFormatClass;

  const buildListClass = (format, layout) =>
    [format, layout].filter(Boolean).join(" ") || null;

  // Update only the INNERMOST orderedList at cursor position.
  // Tiptap's built-in updateAttributes walks ancestors and updates every
  // matching node — which breaks nested lists (outer + inner both get the
  // same class). We walk depths manually to target only the closest ol.
  const setInnermostOrderedListClass = (nextClass) => {
    editor
      .chain()
      .focus()
      .command(({ tr, state }) => {
        const { $from } = state.selection;
        for (let depth = $from.depth; depth >= 0; depth--) {
          const node = $from.node(depth);
          if (node.type.name === "orderedList") {
            const pos = $from.before(depth);
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              class: nextClass || null,
            });
            return true;
          }
        }
        return false;
      })
      .run();
  };

  const toggleOrderedListClass = (format) => {
    const inList = editor.isActive("orderedList");
    if (inList && listFormatClass === format) {
      editor.chain().focus().toggleOrderedList().run();
      return;
    }
    if (inList) {
      setInnermostOrderedListClass(buildListClass(format, listLayoutClass));
      return;
    }
    editor.chain().focus().toggleOrderedList().run();
    setInnermostOrderedListClass(format);
  };

  const toggleListLayout = (layout) => {
    if (!editor.isActive("orderedList")) return;
    const nextLayout = listLayoutClass === layout ? null : layout;
    setInnermostOrderedListClass(buildListClass(listFormatClass, nextLayout));
  };

  const FONTS = [
    { label: "Kalpurush", value: "Kalpurush, sans-serif", bangla: true },
    {
      label: "SolaimanLipi",
      value: "SolaimanLipi, sans-serif",
      bangla: true,
    },
    {
      label: "Siyam Rupali",
      value: '"Siyam Rupali", sans-serif',
      bangla: true,
    },
    { label: "Nikosh", value: "Nikosh, sans-serif", bangla: true },
    { label: "System Sans", value: "system-ui, sans-serif", bangla: false },
    { label: "Serif", value: "Georgia, serif", bangla: false },
    { label: "Monospace", value: "ui-monospace, monospace", bangla: false },
  ];

  const currentFont = editor.getAttributes("textStyle").fontFamily;
  const currentFontLabel = currentFont
    ? (FONTS.find((f) => f.value === currentFont)?.label ??
      currentFont.split(",")[0].replace(/['"]/g, "").trim())
    : "Kalpurush";

  const FONT_SIZES = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
  ];
  const currentFontSize = editor.getAttributes("textStyle").fontSize || null;

  const LINE_HEIGHTS = [
    { label: "১.০ (টাইট)", value: "1" },
    { label: "১.১৫", value: "1.15" },
    { label: "১.৫", value: "1.5" },
    { label: "১.৭৫", value: "1.75" },
    { label: "২.০ (ডাবল)", value: "2" },
    { label: "২.৫", value: "2.5" },
  ];
  const currentLineHeight =
    editor.getAttributes("paragraph").lineHeight ||
    editor.getAttributes("heading").lineHeight ||
    null;

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
    <div className="sticky top-0 z-20 flex items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-zinc-50/95 p-1.5 backdrop-blur scrollbar-hide touch-pan-x dark:border-zinc-700 dark:bg-zinc-900/85">
      {/* Primary: Templates + Blocks */}
      {onOpenTemplates && (
        <button
          type="button"
          onClick={onOpenTemplates}
          title="প্রি-মেইড প্রশ্ন টেমপ্লেট"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-blue-600 bg-blue-600 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:h-8"
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

      {/* Font family */}
      <Dropdown
        title="Font family"
        label={
          <span className="inline-flex items-center gap-1">
            <Type className="h-4 w-4" />
            <span className="max-w-[5rem] truncate text-xs sm:max-w-[7rem] sm:text-sm">
              {currentFontLabel}
            </span>
          </span>
        }
        active={!!currentFont}
        panelWidth={200}
      >
        <DropdownLabel>বাংলা ফন্ট</DropdownLabel>
        <DropdownItem
          active={!currentFont}
          onClick={() => editor.chain().focus().unsetFontFamily().run()}
        >
          Kalpurush (ডিফল্ট)
        </DropdownItem>
        {FONTS.filter((f) => f.bangla && f.label !== "Kalpurush").map((f) => (
          <DropdownItem
            key={f.value}
            active={currentFont === f.value}
            onClick={() =>
              editor.chain().focus().setFontFamily(f.value).run()
            }
          >
            <span style={{ fontFamily: f.value }}>{f.label}</span>
          </DropdownItem>
        ))}
        <DropdownDivider />
        <DropdownLabel>অন্যান্য</DropdownLabel>
        {FONTS.filter((f) => !f.bangla).map((f) => (
          <DropdownItem
            key={f.value}
            active={currentFont === f.value}
            onClick={() =>
              editor.chain().focus().setFontFamily(f.value).run()
            }
          >
            <span style={{ fontFamily: f.value }}>{f.label}</span>
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Font size */}
      <Dropdown
        title="Font size"
        label={
          <span className="inline-flex items-center gap-1">
            <ALargeSmall className="h-4 w-4" />
            <span className="text-xs">{currentFontSize || "—"}</span>
          </span>
        }
        active={!!currentFontSize}
        panelWidth={140}
      >
        <DropdownLabel>ফন্ট সাইজ</DropdownLabel>
        <DropdownItem
          active={!currentFontSize}
          onClick={() => editor.chain().focus().unsetFontSize().run()}
        >
          ডিফল্ট
        </DropdownItem>
        {FONT_SIZES.map((size) => (
          <DropdownItem
            key={size}
            active={currentFontSize === size}
            onClick={() => editor.chain().focus().setFontSize(size).run()}
          >
            <span style={{ fontSize: size }}>{size}</span>
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Line height */}
      <Dropdown
        title="Line height"
        label={
          <span className="inline-flex items-center gap-1">
            <Rows3 className="h-4 w-4" />
            <span className="text-xs">{currentLineHeight || "—"}</span>
          </span>
        }
        active={!!currentLineHeight}
        panelWidth={160}
      >
        <DropdownLabel>লাইন হাইট</DropdownLabel>
        <DropdownItem
          active={!currentLineHeight}
          onClick={() => editor.chain().focus().unsetLineHeight().run()}
        >
          ডিফল্ট
        </DropdownItem>
        {LINE_HEIGHTS.map((lh) => (
          <DropdownItem
            key={lh.value}
            active={currentLineHeight === lh.value}
            onClick={() =>
              editor.chain().focus().setLineHeight(lh.value).run()
            }
          >
            {lh.label}
          </DropdownItem>
        ))}
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
        <DropdownItem
          icon={Languages}
          active={listClass === "en-letters-list"}
          onClick={() => toggleOrderedListClass("en-letters-list")}
        >
          a) b) c) Lettered
        </DropdownItem>
        <DropdownItem
          icon={CircleIcon}
          active={listClass === "en-digits-circle-list"}
          onClick={() => toggleOrderedListClass("en-digits-circle-list")}
        >
          ① ② ③ Circle numbered
        </DropdownItem>
        <DropdownItem
          icon={CircleIcon}
          active={listClass === "en-letters-circle-list"}
          onClick={() => toggleOrderedListClass("en-letters-circle-list")}
        >
          ⓐ ⓑ ⓒ Circle lettered
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
        <DropdownItem
          icon={CircleIcon}
          active={listClass === "bn-digits-circle-list"}
          onClick={() => toggleOrderedListClass("bn-digits-circle-list")}
        >
          ⓵ ⓶ ⓷ বাংলা সংখ্যা (বৃত্ত)
        </DropdownItem>
        <DropdownItem
          icon={CircleIcon}
          active={listClass === "bn-letters-circle-list"}
          onClick={() => toggleOrderedListClass("bn-letters-circle-list")}
        >
          Ⓚ Ⓗ Ⓖ বাংলা অক্ষর (বৃত্ত)
        </DropdownItem>
        <DropdownDivider />
        <DropdownLabel>লেআউট (Layout)</DropdownLabel>
        <DropdownItem
          icon={AlignVerticalSpaceAround}
          active={!listLayoutClass && editor.isActive("orderedList")}
          disabled={!editor.isActive("orderedList")}
          onClick={() => toggleListLayout(null)}
        >
          উল্লম্ব (Vertical)
        </DropdownItem>
        <DropdownItem
          icon={Columns2Icon}
          active={listLayoutClass === "mcq-grid-2"}
          disabled={!editor.isActive("orderedList")}
          onClick={() => toggleListLayout("mcq-grid-2")}
        >
          ২ কলাম গ্রিড (2×2)
        </DropdownItem>
        <DropdownItem
          icon={LayoutGrid}
          active={listLayoutClass === "mcq-grid-4"}
          disabled={!editor.isActive("orderedList")}
          onClick={() => toggleListLayout("mcq-grid-4")}
        >
          ১ সারিতে ৪টি (1×4)
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

      {/* Block wrapper — group selected blocks into a reorderable unit */}
      <IconBtn
        icon={GroupIcon}
        onClick={() =>
          editor.chain().focus().wrapInBlockWrapper().run()
        }
        disabled={!editor.can().wrapInBlockWrapper()}
        title="ব্লক হিসেবে গ্রুপ (duplicate/reorder করতে)"
        active={editor.isActive("blockWrapper")}
      />
      <IconBtn
        icon={UngroupIcon}
        onClick={() =>
          editor.chain().focus().unwrapBlockWrapper().run()
        }
        disabled={!editor.isActive("blockWrapper")}
        title="ব্লক গ্রুপ সরাও"
      />

      <Divider />

      {/* Table */}
      <Dropdown
        title="Table"
        label={<TableIcon className="h-4 w-4" />}
        active={editor.isActive("table")}
        panelWidth={220}
      >
        <DropdownItem
          icon={Grid3x3}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          নতুন টেবিল (৩×৩)
        </DropdownItem>
        <DropdownItem
          icon={Grid3x3}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 2, cols: 5, withHeaderRow: false })
              .run()
          }
        >
          Fill-in টেবিল (২×৫)
        </DropdownItem>
        <DropdownDivider />
        <DropdownLabel>সারি (Row)</DropdownLabel>
        <DropdownItem
          icon={ArrowUp}
          disabled={!editor.can().addRowBefore()}
          onClick={() => editor.chain().focus().addRowBefore().run()}
        >
          উপরে নতুন সারি
        </DropdownItem>
        <DropdownItem
          icon={ArrowDown}
          disabled={!editor.can().addRowAfter()}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          নিচে নতুন সারি
        </DropdownItem>
        <DropdownItem
          icon={RowsIcon}
          disabled={!editor.can().deleteRow()}
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          সারি মুছে ফেলো
        </DropdownItem>
        <DropdownDivider />
        <DropdownLabel>কলাম (Column)</DropdownLabel>
        <DropdownItem
          icon={ArrowLeft}
          disabled={!editor.can().addColumnBefore()}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
        >
          বামে নতুন কলাম
        </DropdownItem>
        <DropdownItem
          icon={ArrowRight}
          disabled={!editor.can().addColumnAfter()}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          ডানে নতুন কলাম
        </DropdownItem>
        <DropdownItem
          icon={Columns3}
          disabled={!editor.can().deleteColumn()}
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          কলাম মুছে ফেলো
        </DropdownItem>
        <DropdownDivider />
        <DropdownLabel>অন্যান্য</DropdownLabel>
        <DropdownItem
          icon={HeadingRowIcon}
          disabled={!editor.can().toggleHeaderRow()}
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        >
          হেডার সারি টগল
        </DropdownItem>
        <DropdownItem
          icon={Trash2}
          disabled={!editor.can().deleteTable()}
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          পুরো টেবিল মুছে ফেলো
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
