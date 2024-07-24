import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleGenerateText = async () => {
    if (!prompt) return; // Handle empty prompt

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyATEBQoC9XkJIMqiSU6PhIX9bQhKFdUIJ4",
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      setResult(response.text());
    } catch (error) {
      console.error("Error generating text:", error);
      setResult("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-2 flex flex-col max-w-64 overflow-auto">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="text-black"
      />
      <button
        onClick={handleGenerateText}
        className="bg-blue-500 rounded-md mt-2"
      >
        Submit
      </button>
      <div>{result}</div>
    </div>
  );
};

// // const { GoogleGenerativeAI } = require("@google/generative-ai");
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI("AIzaSyATEBQoC9XkJIMqiSU6PhIX9bQhKFdUIJ4");

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
