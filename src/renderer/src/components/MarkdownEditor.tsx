import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { useMarkdownEditor } from "@renderer/hooks/useMarkdownEditor";

export const MarkdownEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } =
    useMarkdownEditor();
  if (!selectedNote) return null;

  return (
    <MDXEditor
      ref={editorRef}
      key={selectedNote.title}
      markdown={selectedNote.content}
      onChange={handleAutoSaving}
      onBlur={handleBlur}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      contentEditableClassName="outline-none min-h-screen max-w-none px-8 py-5 caret-yellow-500 prose text-lg prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-200 prose-code:before:content-[''] prose-code:after:content-[''] prose-ul:prose prose-ul:text-slate-300 prose-ul:text-lg " //add prose-invert for dark mode
    />
  );
};
