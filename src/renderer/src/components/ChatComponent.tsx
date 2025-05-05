import { GoogleGenerativeAI } from "@google/generative-ai";
import { selectedNoteAtom, showChatAtom, themeAtom } from "@renderer/store";
import { cn } from "@renderer/utils";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Bot, Send, Trash2 } from "lucide-react";
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
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

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
      // Provide more specific error messages for different error types
      let errorMessage = "An error occurred. Please try again later.";

      // Check for API key errors
      if (error instanceof Error) {
        const errorText = error.message.toLowerCase();
        if (
          errorText.includes("api key") ||
          errorText.includes("authentication") ||
          errorText.includes("unauthorized") ||
          errorText.includes("invalid key")
        ) {
          errorMessage =
            "Invalid API key. Please check your Gemini API key in preferences.";
        } else if (
          errorText.includes("network") ||
          errorText.includes("connection")
        ) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (errorText.includes("quota") || errorText.includes("limit")) {
          errorMessage =
            "API quota exceeded. Please try again later or check your Gemini API plan limits.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content: errorMessage,
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

  // Function to clear chat history
  const clearChat = () => {
    setMessages([]);
    setResult("");
  };

  return (
    <div
      className={twMerge(
        `flex flex-col overflow-hidden max-w-80 h-[100vh] ${
          isLightMode
            ? "bg-slate-100/80 border-l border-l-slate-200/60"
            : "bg-slate-900/80 border-l border-l-slate-800/60"
        } shadow-xl`,
        className,
      )}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isLightMode
            ? "border-slate-200/80 bg-slate-100 backdrop-blur-md"
            : "border-slate-800/80 bg-slate-900 backdrop-blur-md"
        } rounded-md`}
      >
        <div className="flex items-center space-x-2">
          <Bot
            className={`h-4 w-4 ${isLightMode ? "text-blue-500" : "text-blue-400"}`}
          />
          <h3
            className={`font-medium ${isLightMode ? "text-slate-700" : "text-slate-200"} text-sm`}
          >
            AI Assistant
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <motion.button
            onClick={clearChat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={messages.length === 0}
            className={`p-1.5 rounded-full flex items-center justify-center transition-all duration-200 ${
              messages.length === 0
                ? "text-slate-400/50 cursor-not-allowed"
                : isLightMode
                  ? "text-slate-500 hover:text-red-600 hover:bg-red-100/50"
                  : "text-slate-400 hover:text-red-400 hover:bg-red-400/10"
            }`}
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </motion.button>
          <Xbutton
            onClick={() => setShowChat(false)}
            className="relative top-0 right-0 scale-90"
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto py-2 px-2 space-y-2 scrollbar-thin"
      >
        {messages.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center h-full text-center px-6 ${
              isLightMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <Bot
              className={`h-12 w-12 mb-2 ${isLightMode ? "text-slate-400/60" : "text-slate-500/60"}`}
            />
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
                "px-2 py-1.5 rounded-lg max-w-[95%]",
                message.type === "user"
                  ? isLightMode
                    ? "bg-blue-50 border border-blue-200/30 ml-auto"
                    : "bg-blue-600/20 border border-blue-500/30 ml-auto"
                  : isLightMode
                    ? "bg-slate-200/50 border border-slate-300/50 mr-auto"
                    : "bg-slate-800/50 border border-slate-700/50 mr-auto",
              )}
            >
              <Markdown
                remarkPlugins={[gfm]}
                className={`prose ${
                  isLightMode ? "prose-slate" : "prose-invert"
                } prose-sm max-w-full overflow-hidden
                  prose-headings:my-1.5 prose-p:my-1 prose-ul:my-1.5 prose-li:my-0.5 
                  prose-code:px-1 ${
                    isLightMode
                      ? "prose-code:text-red-600 prose-code:bg-slate-100/50"
                      : "prose-code:text-red-200 prose-code:bg-slate-800/50"
                  } prose-code:rounded`}
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="my-2 rounded-md max-w-full object-contain max-h-64"
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
            className={`flex items-center space-x-2 px-2 py-1.5 rounded-lg max-w-[70%] mr-auto ${
              isLightMode
                ? "bg-slate-200/50 border border-slate-300/50"
                : "bg-slate-800/50 border border-slate-700/50"
            }`}
          >
            <ScaleLoader
              color={isLightMode ? "#3b82f6" : "#60a5fa"}
              height={15}
              width={2}
              radius={2}
              margin={2}
            />
            <span
              className={`text-xs ${isLightMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Thinking...
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="backdrop-blur-sm rounded-md">
        <div className="relative">
          <textarea
            value={promptToShow}
            onChange={(e) => {
              setPromptToShow(e.target.value);
              // Auto-resize the textarea
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
            }}
            placeholder="Ask questions..."
            className={cn(
              "w-full text-sm",
              "rounded-lg pl-3 pr-9 py-2.5 focus:outline-none",
              "placeholder:text-slate-400/60",
              "focus:ring-1 focus:ring-blue-500/50",
              "transition-all duration-200 shadow-sm",
              "resize-none min-h-[40px] max-h-[150px] overflow-y-auto",
              "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", // Cross-browser scrollbar hiding
              isLightMode
                ? "bg-white/60 focus:bg-white text-slate-800 border border-slate-300/80 focus:border-blue-500/80"
                : "bg-slate-900/60 focus:bg-slate-900 text-white border border-slate-700/80 focus:border-blue-500/80",
            )}
            onKeyDown={handleKeyDown}
            rows={1}
            ref={textareaRef}
          />
          <button
            className={`absolute right-2 top-2 ${
              isLightMode
                ? "text-slate-500 hover:text-blue-600"
                : "text-slate-400 hover:text-blue-500"
            } transition-colors p-1`}
            onClick={handleGenerateText}
            disabled={loading || !promptToShow.trim()}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {!geminiApiKey && (
          <p className={`text-amber-500/80 text-xs px-2`}>
            Please set your Gemini API key in preferences to use the AI
            assistant.
          </p>
        )}
      </div>
    </div>
  );
};
