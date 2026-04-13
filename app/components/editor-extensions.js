import { Extension } from "@tiptap/core";

/**
 * Preserve inline `style` attribute on block nodes + `class` on lists +
 * `style` on textStyle (inline span) marks. Lets template HTML round-trip
 * through Tiptap without losing layout-related inline styles.
 */
export const StylePreserve = Extension.create({
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

/** Font size — typed attribute on textStyle mark, rendered as inline CSS. */
export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});

/** Line height — typed attribute on block nodes, applied via inline CSS. */
export const LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() {
    return { types: ["paragraph", "heading", "blockquote"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (el) => el.style.lineHeight || null,
            renderHTML: (attrs) =>
              attrs.lineHeight
                ? { style: `line-height: ${attrs.lineHeight}` }
                : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain }) => {
          let c = chain().focus();
          this.options.types.forEach((type) => {
            c = c.updateAttributes(type, { lineHeight });
          });
          return c.run();
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          let c = chain().focus();
          this.options.types.forEach((type) => {
            c = c.updateAttributes(type, { lineHeight: null });
          });
          return c.run();
        },
    };
  },
});
