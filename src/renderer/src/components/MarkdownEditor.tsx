import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { useMarkdownEditor } from "@renderer/hooks/useMarkdownEditor";
import { themeAtom } from "@renderer/store";
import { cn } from "@renderer/utils";
import { useAtomValue } from "jotai";

export const MarkdownEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } =
    useMarkdownEditor();
  const theme = useAtomValue(themeAtom);

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

  const isDarkMode = theme === "dark";

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-2 mt-1">
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
            linkDialogPlugin(),
            imagePlugin({
              imageUploadHandler,
            }),
            toolbarPlugin({
              toolbarClassName: cn(
                isDarkMode ? "bg-slate-800/70" : "bg-slate-100/70",
                "border rounded-md shadow-sm backdrop-blur-sm",
                isDarkMode ? "border-slate-700/50" : "border-slate-300/50",
              ),
              toolbarContents: () => (
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <ListsToggle />
                  <BlockTypeSelect />
                  <CreateLink />
                  <InsertImage />
                  <InsertThematicBreak />
                </div>
              ),
            }),
          ]}
          contentEditableClassName={`outline-none max-w-none px-8 py-5 caret-yellow-500 prose ${
            isDarkMode
              ? 'text-lg prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-200 prose-code:before:content-[""] prose-code:after:content-[""] prose-ul:prose prose-ul:text-slate-300 prose-ul:text-lg prose-img:max-w-full'
              : 'text-lg prose-slate prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-700 prose-code:before:content-[""] prose-code:after:content-[""] prose-ul:prose prose-ul:text-slate-700 prose-ul:text-lg prose-img:max-w-full'
          }`}
        />
      </div>
    </div>
  );
};
