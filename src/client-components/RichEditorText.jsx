"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaPalette,
  FaLink,
  FaUnlink,
} from "react-icons/fa";

// Supports saving and restoring font families in the blog HTML.
const FontFamily = Extension.create({
  name: "fontFamily",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontFamily: {
            default: null,

            parseHTML: (element) =>
              element.style.fontFamily?.replace(/['"]/g, "") || null,

            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },
});

const FONT_OPTIONS = [
  { label: "Aptos", value: "Aptos, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

function isAllowedLinkUrl(value) {
  try {
    const url = new URL(value);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return Boolean(url.hostname);
    }

    return (
      (url.protocol === "mailto:" || url.protocol === "tel:") &&
      Boolean(url.pathname.trim())
    );
  } catch {
    return false;
  }
}

function ToolbarButton({ onClick, onMouseDown, isActive, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`p-1.5 rounded transition-all duration-200 border cursor-pointer flex items-center justify-center text-sm ${
        isActive
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = "" }) {
  const [linkDialog, setLinkDialog] = useState({
    from: 0,
    to: 0,
    editingLink: false,
    url: "",
    error: "",
  });

  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const linkInputRef = useRef(null);
  const linkDialogRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        protocols: ["http", "https", "mailto", "tel"],
        isAllowedUri: isAllowedLinkUrl,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],

    content: value || "",
    editorProps: {
      attributes: {
        "data-placeholder": placeholder,
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const closeLinkDialog = useCallback(() => {
    setIsLinkDialogOpen(false);
    window.requestAnimationFrame(() => editor?.commands.focus());
  }, [editor]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!isLinkDialogOpen) return;

    linkInputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeLinkDialog();
      } else if (event.key === "Tab") {
        const focusableElements = linkDialogRef.current?.querySelectorAll(
          "input:not([disabled]), button:not([disabled])",
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeLinkDialog, isLinkDialogOpen]);

  if (!editor) return null;

  function openLinkDialog() {
    const { from, to, empty } = editor.state.selection;
    const editingLink = editor.isActive("link");

    setIsLinkDialogOpen(true);

    setLinkDialog({
      from,
      to,
      editingLink,
      url: editingLink ? editor.getAttributes("link").href || "" : "",
      error:
        empty && !editingLink
          ? "Select the text to link, or place the cursor inside an existing link."
          : "",
    });
  }

  function saveLink() {
    const url = linkDialog.url.trim();

    if (!linkDialog.editingLink && linkDialog.from === linkDialog.to) {
      setLinkDialog({
        ...linkDialog,
        error:
          "Select the text to link, or place the cursor inside an existing link.",
      });
      return;
    }

    if (!isAllowedLinkUrl(url)) {
      setLinkDialog({
        ...linkDialog,
        error: "Enter a valid http://, https://, mailto:, or tel: URL.",
      });
      return;
    }

    const chain = editor.chain().focus().setTextSelection({
      from: linkDialog.from,
      to: linkDialog.to,
    });

    if (linkDialog.editingLink && linkDialog.from === linkDialog.to) {
      chain.extendMarkRange("link");
    }

    if (chain.setLink({ href: url }).run()) {
      closeLinkDialog();
    } else {
      setLinkDialog({
        ...linkDialog,
        error: "The link could not be applied. Select text and try again.",
      });
    }
  }

  function removeLink() {
    editor
      .chain()
      .focus()
      .setTextSelection({
        from: linkDialog.from,
        to: linkDialog.to,
      })
      .extendMarkRange("link")
      .unsetLink()
      .run();

    closeLinkDialog();
  }

  const selectedFontFamily = editor.getAttributes("textStyle").fontFamily || "";

  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-white overflow-hidden transition-all duration-200">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50/50 flex-wrap items-center">
        {/* Heading dropdown */}
        <select
          value={
            editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : editor.isActive("heading", { level: 4 })
                  ? "h4"
                  : editor.isActive("heading", { level: 5 })
                    ? "h5"
                    : editor.isActive("heading", { level: 6 })
                      ? "h6"
                      : "p"
          }
          onChange={(e) => {
            const val = e.target.value;

            if (val === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(val.replace("h", ""), 10);
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          className="bg-white border border-gray-300 text-gray-700 text-xs rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer font-medium"
          aria-label="Text format"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        {/* NEW: Font family dropdown */}
        <select
          value={selectedFontFamily}
          onChange={(event) => {
            const fontFamily = event.target.value;

            if (!fontFamily) return;

            editor.chain().focus().setMark("textStyle", { fontFamily }).run();
          }}
          aria-label="Font family"
          title="Choose font family"
          className="max-w-full bg-white border border-gray-300 text-gray-700 text-xs rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="">Font family</option>
          {FONT_OPTIONS.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>

        <div className="h-5 w-[1px] bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <FaBold />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <FaItalic />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <FaUnderline />
        </ToolbarButton>

        <div className="h-5 w-[1px] bg-gray-300 mx-1" />

        <ToolbarButton
          onMouseDown={(event) => event.preventDefault()}
          onClick={openLinkDialog}
          isActive={editor.isActive("link")}
          title="Add or edit link"
        >
          <FaLink />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          isActive={false}
          title="Remove link"
        >
          <FaUnlink />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <FaListUl />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <FaListOl />
        </ToolbarButton>

        <div className="h-5 w-[1px] bg-gray-300 mx-1" />

        {/* Text color picker */}
        <div className="flex items-center gap-1.5 pl-1" title="Text Color">
          <FaPalette className="text-gray-500 text-sm" />
          <input
            type="color"
            value={editor.getAttributes("textStyle").color || "#000000"}
            onInput={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            aria-label="Text color"
            className="w-6 h-6 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
          />
        </div>
      </div>

      {/* Editor input area */}
      <EditorContent editor={editor} className="p-4 min-h-[300px]" />

      {/* Link dialog */}
      {isLinkDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLinkDialog();
          }}
        >
          <section
            ref={linkDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-dialog-title"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
          >
            <h2
              id="link-dialog-title"
              className="mb-4 text-lg font-semibold text-gray-900"
            >
              {linkDialog.editingLink ? "Edit link" : "Add link"}
            </h2>

            <label htmlFor="rich-text-link-url" className="form-label mb-2">
              URL
            </label>

            <input
              ref={linkInputRef}
              id="rich-text-link-url"
              type="url"
              value={linkDialog.url}
              onChange={(event) =>
                setLinkDialog({
                  ...linkDialog,
                  url: event.target.value,
                  error: "",
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  saveLink();
                }
              }}
              placeholder="https://example.com"
              aria-describedby={
                linkDialog.error ? "rich-text-link-error" : undefined
              }
              className="form-input"
            />

            {linkDialog.error && (
              <p
                id="rich-text-link-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {linkDialog.error}
              </p>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {linkDialog.editingLink && (
                <button
                  type="button"
                  onClick={removeLink}
                  className="mr-auto rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Remove Link
                </button>
              )}

              <button
                type="button"
                onClick={closeLinkDialog}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveLink}
                className="rounded-md bg-primary px-3 py-2 text-sm text-white hover:opacity-90"
              >
                Save Link
              </button>
            </div>
          </section>
        </div>
      )}

      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 300px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #1f2937;
        }

        .ProseMirror[data-placeholder]:has(> p:only-child):has(> p > br.ProseMirror-trailingBreak)::before {
          content: attr(data-placeholder);
          position: absolute;
          color: #9ca3af;
          pointer-events: none;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .ProseMirror h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .ProseMirror h4 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .ProseMirror h5 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .ProseMirror h6 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .ProseMirror p {
          margin-top: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .ProseMirror a {
          color: #9a3412;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.4rem;
          margin-bottom: 0.4rem;
        }

        .ProseMirror u {
          text-decoration: underline;
        }

        .ProseMirror strong {
          font-weight: 700;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror ul li,
        .ProseMirror ol li {
          margin-bottom: 0.2rem;
        }
      `}</style>
    </div>
  );
}
