import {
  headingsPlugin,
  imagePlugin,
  linkPlugin,
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

  // Image handler that properly processes images
  const imageUploadHandler = async (image: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Make sure we have a result
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          console.error("Failed to read image file");
          resolve(""); // Return empty string if failed
        }
      };
      reader.readAsDataURL(image);
    });
  };

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
        linkPlugin(),
        imagePlugin({
          imageUploadHandler,
          // Allow native paste handling for images
        }),
      ]}
      contentEditableClassName="outline-none max-w-none px-8 py-5 caret-yellow-500 prose text-lg prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-200 prose-code:before:content-[''] prose-code:after:content-[''] prose-ul:prose prose-ul:text-slate-300 prose-ul:text-lg prose-img:max-w-full"
    />
  );
};
