import { useAtomValue, useSetAtom } from "jotai";
import { ComponentProps, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { BarLoader } from "react-spinners";
import gfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import { selectedNoteAtom, showChatAtom } from "@renderer/store";
import { GenericButton, Xbutton } from "./Button";

// Commented out Gemini import
// import { GoogleGenerativeAI } from "@google/generative-ai";

export const ChatComponent = ({ className }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);
  const [result, setResult] = useState("");
  // const [geminiApiKey, setGeminiApiKey] = useState("");
  const [promptToShow, setPromptToShow] = useState("");
  const setShowChat = useSetAtom(showChatAtom);
  const [loading, setLoading] = useState(false);

  const handleGenerateText = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/ai", {
        text: selectedNote?.content || "",
        prompt: promptToShow,
      });
      setResult(response.data.reply);
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={twMerge(
        "p-2 flex flex-col overflow-auto  max-w-72 h-[100vh]",
        className,
      )}
    >
      <div className="flex flex-row justify-center mb-2">
        <span>AI CHAT</span>
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
      <div className="prose prose-invert">
        <div className="flex flex-row items-center mt-1">
          <BarLoader
            loading={loading}
            width={"100%"}
            height={4}
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
