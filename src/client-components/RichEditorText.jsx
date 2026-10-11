'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEffect } from 'react';
import { 
    FaBold, 
    FaItalic, 
    FaUnderline, 
    FaListUl, 
    FaListOl, 
    FaPalette 
} from 'react-icons/fa';

export default function RichTextEditor({
    value,
    onChange
}) {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
        ],

        content: value || '',

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) return null;

    const Button = ({ onClick, isActive, children, title }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-1.5 rounded transition-all duration-200 border cursor-pointer flex items-center justify-center text-sm ${
                isActive 
                    ? 'bg-primary text-white border-primary shadow-sm' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
            }`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-white overflow-hidden transition-all duration-200">

            {/* Toolbar */}
            <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50/50 flex-wrap items-center">

                {/* Dropdown for Headings and Paragraph */}
                <select
                    value={
                        editor.isActive('heading', { level: 2 }) ? 'h2' :
                        editor.isActive('heading', { level: 3 }) ? 'h3' :
                        editor.isActive('heading', { level: 4 }) ? 'h4' :
                        editor.isActive('heading', { level: 5 }) ? 'h5' :
                        editor.isActive('heading', { level: 6 }) ? 'h6' : 'p'
                    }
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'p') {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            const level = parseInt(val.replace('h', ''), 10);
                            editor.chain().focus().toggleHeading({ level }).run();
                        }
                    }}
                    className="bg-white border border-gray-300 text-gray-700 text-xs rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer font-medium"
                >
                    <option value="p">Paragraph</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                </select>

                <div className="h-5 w-[1px] bg-gray-300 mx-1" />

                <Button 
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <FaBold />
                </Button>

                <Button 
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <FaItalic />
                </Button>

                <Button 
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <FaUnderline />
                </Button>

                <div className="h-5 w-[1px] bg-gray-300 mx-1" />

                <Button 
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <FaListUl />
                </Button>

                <Button 
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <FaListOl />
                </Button>

                <div className="h-5 w-[1px] bg-gray-300 mx-1" />

                {/* Color Picker */}
                <div className="flex items-center gap-1.5 pl-1" title="Text Color">
                    <FaPalette className="text-gray-500 text-sm" />
                    <input
                        type="color"
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                        className="w-6 h-6 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
                    />
                </div>

            </div>

            {/* Editor Input Area */}
            <EditorContent
                editor={editor}
                className="p-4 min-h-[300px]"
            />

            <style>{`
                .ProseMirror {
                    outline: none;
                    min-height: 300px;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #1f2937;
                }
                .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
                .ProseMirror h3 { font-size: 1.3rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
                .ProseMirror h4 { font-size: 1.15rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
                .ProseMirror h5 { font-size: 1.1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
                .ProseMirror h6 { font-size: 1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #111827; }
                .ProseMirror p { margin-top: 0.4rem; margin-bottom: 0.4rem; }
                .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.4rem; margin-bottom: 0.4rem; }
                .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.4rem; margin-bottom: 0.4rem; }
                .ProseMirror u { text-decoration: underline; }
                .ProseMirror strong { font-weight: 700; }
                .ProseMirror em { font-style: italic; }
                .ProseMirror ul li, .ProseMirror ol li { margin-bottom: 0.2rem; }
            `}</style>

        </div>
    );
}