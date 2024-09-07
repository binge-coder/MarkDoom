import { PropsWithChildren } from "react";
import React, { useState, useEffect } from "react";
import { Xbutton } from "@/components/Button";

const PrefListItem: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  return (
    <div
      className="border border-slate-400 rounded-md p-1 mb-1 flex justify-between"
      {...props}
    >
      {children}
    </div>
  );
};
type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export const PreferencesPage: React.FC<Props> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  const [geminiKeyInput, setgeminiKeyInput] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await window.context.getSettings(); // Fetch the settings
      setgeminiKeyInput(settings.geminiApi || ""); // Set the Gemini API key
    };
    fetchSettings();
  }, []);

  const handleApiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setgeminiKeyInput(e.target.value);
  };

  const handleSave = async () => {
    const newSettings = { geminiApi: geminiKeyInput, language: "en" }; // Update the settings
    await window.context.saveSettings(newSettings); // Save the settings
    console.log("Settings saved.");
  };

  return (
    <div className="fixed inset-10 bg-white rounded-md shadow-lg text-black border-double border-4 border-black">
      <Xbutton onClick={onClose}></Xbutton>
      <h2 className="text-lg font-bold my-4 ml-4">Preferences</h2>
      <div className="m-4">
        <PrefListItem>
          Your Gemini API key:{" "}
          <input
            type="text"
            className="border border-black min-w-96 px-1"
            placeholder="paste your key"
            value={geminiKeyInput}
            onChange={handleApiInput}
          />
        </PrefListItem>
        <div className="flex justify-center">
          <button
            className="bg-slate-500 active:bg-green-800 text-white px-4 py-2 rounded mt-4 hover:bg-gray-800"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
