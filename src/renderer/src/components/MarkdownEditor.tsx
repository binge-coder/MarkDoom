import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
} from "@mdxeditor/editor";

export const MarkdownEditor = () => {
  return (
    <MDXEditor
      markdown={`# Hello from MDX *this is single ast*        
        this is content
        Ad aute ullamco esse cillum magna commodo minim eiusmod sint. Nulla commodo est in officia dolore nulla. Cupidatat nostrud elit cillum dolor. Incididunt sint excepteur laboris amet incididunt occaecat. Quis nulla dolore cillum qui minim id eu deserunt mollit ullamco ut eu sunt. Irure voluptate esse reprehenderit quis proident dolore incididunt commodo aliqua fugiat anim.

Exercitation ad id nostrud nulla veniam consectetur ut occaecat aliquip pariatur reprehenderit. Esse ullamco nisi dolore deserunt minim in elit laboris. Laborum nulla aliquip anim veniam culpa laborum. Duis est quis amet pariatur ut quis ut proident esse deserunt commodo. Aliqua duis exercitation occaecat id fugiat aliquip enim non.

Occaecat consectetur duis magna aliquip pariatur id deserunt voluptate irure nulla fugiat sint aliquip. Voluptate mollit duis in laboris tempor aliqua. Cillum veniam aliquip elit cillum. Deserunt proident elit amet duis irure aliqua culpa tempor est cupidatat aute Lorem velit aliquip. Mollit incididunt laborum occaecat dolore dolore aliquip eu exercitation. Pariatur enim ullamco sunt minim.

Mollit do tempor consectetur velit quis non mollit cupidatat non adipisicing magna occaecat. Fugiat nisi commodo nisi do dolore tempor nostrud ex duis reprehenderit proident. Nostrud deserunt ullamco Lorem Lorem excepteur aliquip cupidatat ex incididunt tempor nulla. Labore enim ex aliqua nostrud labore id commodo est cupidatat ea sint elit tempor. Non eu officia sunt labore ex adipisicing dolore do consectetur ullamco pariatur incididunt excepteur. Fugiat ullamco commodo do reprehenderit et velit in officia est qui nisi ex. Aliqua aliqua culpa voluptate enim veniam Lorem.
        `}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
      ]}
      contentEditableClassName="outline-none min-h-screen max-w-none text-lg px-8 py-5 caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
    />
  );
};
