import { GoogleGenerativeAI } from "@google/generative-ai";
import { selectedNoteAtom, showChatAtom } from "@renderer/store";
import { motion } from "framer-motion";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ComponentProps, useEffect, useState } from "react";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import { GenericButton, Xbutton } from "./Button";
import { geminiApiKeyAtom } from "./PreferencesPage";

export const ChatComponent = ({ className }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const [result, setResult] = useState("");

  // Use the shared Jotai atom for the API key instead of local state
  const [geminiApiKey] = useAtom(geminiApiKeyAtom);

  const [promptToShow, setPromptToShow] = useState("");
  const setShowChat = useSetAtom(showChatAtom);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<string>();

  useEffect(() => {
    if (selectedNote && selectedNote.content != "") {
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
          // We need to access the atom setter from the outside of this component
          // since we're using useAtom which gives us a local setter
          const event = new CustomEvent("update-gemini-api-key", {
            detail: { apiKey: settings.geminiApi },
          });
          window.dispatchEvent(event);
        }
      }
    };
    fetchSettings();
  }, [geminiApiKey]);

  const handleGenerateText = async () => {
    if (!promptToShow) return; // Handle empty prompt
    if (!geminiApiKey) {
      setResult("Gemini API key is missing. Please set it in preferences.");
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey); // Use the Gemini API key from Jotai atom
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const AIPrompt = promptToShow + context;
      console.log(AIPrompt);
      const result = await model.generateContent(AIPrompt);
      const response = result.response;
      console.log(response.text());

      setResult(response.text());
    } catch (error) {
      console.error("Error generating text:", error);
      setResult("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={twMerge(
        "p-2 flex flex-col overflow-auto max-w-72 h-[100vh]",
        className,
      )}
    >
      <div className="flex flex-row justify-center mb-2">
        <span>AI Assistant</span>
        <Xbutton onClick={() => setShowChat(false)} />
      </div>
      <input
        type="text"
        value={promptToShow}
        onChange={(e) => setPromptToShow(e.target.value)}
        placeholder="Enter your prompt"
        className="text-black px-2 rounded py-1 bg-slate-200 focus:outline-black mb-2"
      />
      <GenericButton onClick={handleGenerateText} className="w-full mb-2">
        Submit
      </GenericButton>
      <div className="prose prose-invert prose-sm max-w-full overflow-x-hidden overflow-y-auto">
        <div className="flex flex-row items-center">
          {loading && (
            <motion.div
              className="w-full h-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 rounded-sm"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                scaleX: { duration: 2, repeat: Infinity },
                opacity: { duration: 0.5 },
              }}
            />
          )}
        </div>
        <Markdown
          remarkPlugins={[gfm]}
          className="prose-headings:my-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-code:px-1 prose-code:text-red-200 prose-code:bg-slate-800/50 prose-code:rounded prose-img:max-w-full"
          components={{
            // Add custom image component to improve rendering
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="my-4 rounded-md max-w-full object-contain max-h-64"
                loading="lazy"
                onError={(e) => {
                  // Fallback for failed images
                  e.currentTarget.style.display = "none";
                  console.error("Image failed to load:", props.src);
                }}
              />
            ),
          }}
        >
          {result}
        </Markdown>
      </div>
    </div>
  );
};
