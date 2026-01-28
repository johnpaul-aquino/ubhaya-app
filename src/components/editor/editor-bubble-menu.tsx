'use client';

import { type Editor } from '@tiptap/react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Highlighter,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorBubbleMenuProps {
  editor: Editor;
}

/**
 * Bubble Menu Component
 * Floating toolbar that appears when text is selected
 */
export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      setIsVisible(hasSelection && editor.isFocused);
    };

    editor.on('selectionUpdate', updateVisibility);
    editor.on('focus', updateVisibility);
    editor.on('blur', () => setIsVisible(false));

    return () => {
      editor.off('selectionUpdate', updateVisibility);
      editor.off('focus', updateVisibility);
      editor.off('blur', () => setIsVisible(false));
    };
  }, [editor]);

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'fixed z-50 flex items-center gap-0.5 p-1 rounded-lg border border-border',
        'bg-popover shadow-lg animate-in fade-in-0 zoom-in-95',
        'pointer-events-auto'
      )}
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <BubbleButton
        icon={<Bold className="h-4 w-4" />}
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      />
      <BubbleButton
        icon={<Italic className="h-4 w-4" />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      />
      <BubbleButton
        icon={<UnderlineIcon className="h-4 w-4" />}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
      />
      <BubbleButton
        icon={<Strikethrough className="h-4 w-4" />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
      />
      <BubbleButton
        icon={<Code className="h-4 w-4" />}
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
      />
      <BubbleButton
        icon={<Highlighter className="h-4 w-4" />}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
      />
      <div className="w-px h-5 bg-border mx-1" />
      <BubbleButton
        icon={<LinkIcon className="h-4 w-4" />}
        onClick={setLink}
        active={editor.isActive('link')}
      />
    </div>
  );
}

interface BubbleButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

function BubbleButton({ icon, onClick, active }: BubbleButtonProps) {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className="h-7 w-7"
      onClick={onClick}
      type="button"
    >
      {icon}
    </Button>
  );
}
