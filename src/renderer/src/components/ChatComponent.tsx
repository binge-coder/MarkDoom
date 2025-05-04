import { GoogleGenerativeAI } from "@google/generative-ai";
import { selectedNoteAtom, showChatAtom } from "@renderer/store";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Bot, Send } from "lucide-react";
import { ComponentProps, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { ScaleLoader } from "react-spinners";
import gfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import { Xbutton } from "./Button";
import { geminiApiKeyAtom } from "./PreferencesPage";

export const ChatComponent = ({ className }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const [result, setResult] = useState("");
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "assistant"; content: string }>
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Use the shared Jotai atom for the API key instead of local state
  const [geminiApiKey] = useAtom(geminiApiKeyAtom);

  const [promptToShow, setPromptToShow] = useState("");
  const setShowChat = useSetAtom(showChatAtom);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<string>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedNote && selectedNote.content !== "") {
      setContext(
        `\nPlease use the following information as context:\n${selectedNote.content}`,
      );
    } else {
      setContext("");
    }
  }, [selectedNote]);

  // Load API key from settings if not already set through Jotai
  useEffect(() => {
    const fetchSettings = async () => {
      if (!geminiApiKey) {
        const settings = await window.context.getSettings();
        if (settings.geminiApi) {
          const event = new CustomEvent("update-gemini-api-key", {
            detail: { apiKey: settings.geminiApi },
          });
          window.dispatchEvent(event);
        }
      }
    };
    fetchSettings();
  }, [geminiApiKey]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleGenerateText = async () => {
    if (!promptToShow.trim()) return; // Handle empty prompt

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { type: "user", content: promptToShow.trim() },
    ]);

    if (!geminiApiKey) {
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "Gemini API key is missing. Please set it in preferences.",
        },
      ]);
      setPromptToShow("");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const AIPrompt = promptToShow + context;
      const result = await model.generateContent(AIPrompt);
      const response = result.response;
      const responseText = response.text();

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { type: "assistant", content: responseText },
      ]);

      // Clear the input
      setPromptToShow("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    } catch (error) {
      console.error("Error generating text:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: "An error occurred. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateText();
    }
  };

  return (
    <div
      className={twMerge(
        "flex flex-col overflow-hidden max-w-72 h-[100vh] bg-slate-900/80 border-l border-l-slate-800/60 shadow-xl",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-800/50 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Bot className="h-4 w-4 text-blue-400" />
          <h3 className="font-medium text-slate-200 text-sm">AI Assistant</h3>
        </div>
        <Xbutton
          onClick={() => setShowChat(false)}
          className="relative top-0 right-0 scale-90"
        />
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 text-slate-400">
            <Bot className="h-12 w-12 mb-2 text-slate-500/60" />
            <p className="text-sm">
              Ask me any question or request assistance with your notes.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={twMerge(
                "px-3 py-2 rounded-lg max-w-[95%]",
                message.type === "user"
                  ? "bg-blue-600/20 border border-blue-500/30 ml-auto"
                  : "bg-slate-800/50 border border-slate-700/50 mr-auto",
              )}
            >
              <Markdown
                remarkPlugins={[gfm]}
                className="prose prose-invert prose-sm max-w-full overflow-hidden
                  prose-headings:my-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 
                  prose-code:px-1 prose-code:text-red-200 prose-code:bg-slate-800/50 prose-code:rounded"
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="my-3 rounded-md max-w-full object-contain max-h-64"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        console.error("Image failed to load:", props.src);
                      }}
                    />
                  ),
                }}
              >
                {message.content}
              </Markdown>
            </motion.div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-[70%] mr-auto"
          >
            <ScaleLoader
              color="#60a5fa"
              height={15}
              width={2}
              radius={2}
              margin={2}
            />
            <span className="text-xs text-slate-400">Thinking...</span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-800/30 backdrop-blur-sm">
        <div className="relative flex items-end bg-slate-700/50 rounded-lg border border-slate-600/50 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={promptToShow}
            onChange={(e) => setPromptToShow(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="w-full px-3 py-2.5 bg-transparent text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none min-h-[40px] max-h-[120px] text-sm"
            rows={1}
            onInput={(e) => {
              // Auto-resize based on content
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(120, Math.max(40, target.scrollHeight))}px`;
            }}
          />
          <motion.button
            onClick={handleGenerateText}
            disabled={loading || !promptToShow.trim()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center justify-center p-2 mr-2 mb-2 rounded-full 
              ${promptToShow.trim() ? "text-blue-500 hover:bg-blue-500/20" : "text-slate-500 cursor-not-allowed"} 
              transition-all duration-200`}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
        {!geminiApiKey && (
          <p className="text-amber-400/80 text-xs mt-1.5 px-2">
            Please set your Gemini API key in preferences to use the AI
            assistant.
          </p>
        )}
      </div>
    </div>
  );
};
