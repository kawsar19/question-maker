"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { DOMSerializer } from "@tiptap/pm/model";
import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Copy,
  CopyPlus,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function BlockWrapperView({
  node,
  editor,
  getPos,
  deleteNode,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
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

  const duplicate = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos == null) return;
    const end = pos + node.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(end, node.toJSON())
      .run();
    setOpen(false);
  };

  const copyHtml = () => {
    try {
      const serializer = DOMSerializer.fromSchema(editor.schema);
      const fragment = serializer.serializeNode(node);
      const tmp = document.createElement("div");
      tmp.appendChild(fragment);
      navigator.clipboard?.writeText(tmp.innerHTML);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[BlockWrapper] copy failed", err);
    }
    setOpen(false);
  };

  const remove = () => {
    deleteNode();
    setOpen(false);
  };

  const moveUp = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos == null) return;
    const { doc } = editor.state;
    const $pos = doc.resolve(pos);
    if ($pos.index() === 0) return;
    const prev = doc.child($pos.index() - 1);
    const prevPos = pos - prev.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(prevPos, node.toJSON())
      .command(({ tr }) => {
        // delete the OLD position (now shifted by inserted content)
        const delFrom = pos + node.nodeSize;
        const delTo = delFrom + node.nodeSize;
        tr.delete(delFrom, delTo);
        return true;
      })
      .run();
    setOpen(false);
  };

  const moveDown = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos == null) return;
    const { doc } = editor.state;
    const end = pos + node.nodeSize;
    if (end >= doc.content.size) return;
    const $end = doc.resolve(end);
    const next = $end.nodeAfter;
    if (!next) return;
    const afterNextPos = end + next.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(afterNextPos, node.toJSON())
      .command(({ tr }) => {
        tr.delete(pos, pos + node.nodeSize);
        return true;
      })
      .run();
    setOpen(false);
  };

  return (
    <NodeViewWrapper
      as="div"
      className="block-wrapper"
      data-block-wrapper="true"
    >
      <div
        ref={rootRef}
        className="block-menu"
        data-open={open ? "true" : "false"}
        contentEditable={false}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          title="ব্লক মেনু"
          className="block-menu-trigger"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {open && (
          <div className="block-menu-panel">
            <button
              type="button"
              onClick={duplicate}
              className="block-menu-item"
            >
              <CopyPlus className="h-4 w-4" />
              <span>Duplicate</span>
            </button>
            <button
              type="button"
              onClick={copyHtml}
              className="block-menu-item"
            >
              <Copy className="h-4 w-4" />
              <span>Copy HTML</span>
            </button>
            <button
              type="button"
              onClick={moveUp}
              className="block-menu-item"
            >
              <ChevronUp className="h-4 w-4" />
              <span>Move up</span>
            </button>
            <button
              type="button"
              onClick={moveDown}
              className="block-menu-item"
            >
              <ChevronDown className="h-4 w-4" />
              <span>Move down</span>
            </button>
            <div className="block-menu-sep" />
            <button
              type="button"
              onClick={remove}
              className="block-menu-item block-menu-item-danger"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete block</span>
            </button>
          </div>
        )}
      </div>
      <NodeViewContent className="block-content" />
    </NodeViewWrapper>
  );
}
