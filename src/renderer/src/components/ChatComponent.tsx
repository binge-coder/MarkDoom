import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { selectedNoteAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { showChatAtom } from "@renderer/store";
import { GenericButton, Xbutton } from "./Button";
import { twMerge } from "tailwind-merge";
import { ComponentProps } from "react";
import { BarLoader } from "react-spinners";

// interface ChatComponentProps {
//   className?: string;
// }

export const ChatComponent = ({ className }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const [context, setContext] = useState(
    selectedNote && selectedNote.content != ""
      ? `\nPlease use the following information as context:\n${selectedNote.content}`
      : "",
  );
  const [result, setResult] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState(""); // State to hold the Gemini API key
  const [promptToShow, setPromptToShow] = useState(""); // State to hold the prompt to show
  const setShowChat = useSetAtom(showChatAtom);
  const [loading, setLoading] = useState(false);

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
        "p-2 flex flex-col overflow-auto min-w-[250px] max-w-72 h-[100vh]",
        className,
      )}
    >
      <div className="flex flex-row justify-center mb-2">
        <span>GEMINI CHAT</span>
        <Xbutton onClick={() => setShowChat(false)} />
      </div>
      <input
        type="text"
        value={promptToShow}
        onChange={(e) => setPromptToShow(e.target.value)}
        placeholder="Enter your prompt"
        className="text-black px-2 rounded py-1 bg-slate-200 focus:outline-black mb-2"
      />
      <GenericButton onClick={handleGenerateText}>Submit</GenericButton>
      {/* <div>{result}</div> */}
      <div className="prose prose-invert">
        {/* {loading ? "loading..." : null} */}
        <div className="flex flex-row items-center mt-1">
          <BarLoader
            // color="#4f46e5" // Tailwind's 'indigo-600' color
            loading={loading} // Control when the loader shows
            width={"100%"} // Width of the loader
            height={4} // Height of the loader bars
            aria-label="Loading"
          />
        </div>
        <Markdown remarkPlugins={[gfm]}>{result}</Markdown>
      </div>
    </div>
  );
};

// // const { GoogleGenerativeAI } = require("@google/generative-ai");
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI("");

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export async function generateText(prompt) {
//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Error generating text:", error);
//     return "An error occurred. Please try again later.";
//   }
// }
