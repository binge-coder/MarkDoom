import { GoogleGenerativeAI } from "@google/generative-ai";
import { selectedNoteAtom, showChatAtom } from "@renderer/store";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { ComponentProps, useEffect, useState } from "react";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import { GenericButton, Xbutton } from "./Button";

export const ChatComponent = ({ className }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const [result, setResult] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState(""); // State to hold the Gemini API key
  const [promptToShow, setPromptToShow] = useState(""); // State to hold the prompt to show
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

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await window.context.getSettings(); // Fetch settings from preload
      setGeminiApiKey(settings.geminiApi); // Set the Gemini API key from settings
    };
    fetchSettings();
  }, []);

  const handleGenerateText = async () => {
    if (!promptToShow) return; // Handle empty prompt
    if (!geminiApiKey) {
      setResult(
        "Gemini API key is missing. Please set it in preferences. Then close and open chat window again.",
      );
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey); // Use the Gemini API key
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
      <div className="prose prose-invert">
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
        <Markdown remarkPlugins={[gfm]}>{result}</Markdown>
      </div>
    </div>
  );
};
