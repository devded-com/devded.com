"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: () => void;
}

export function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/50">
      <Button
        type="button"
        variant={editor.isActive("bold") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("italic") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("underline") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("strike") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("code") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("blockquote") ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={addLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onImageUpload}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
