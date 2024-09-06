import { PropsWithChildren } from "react";
import React, { useState, useEffect } from "react";

const PrefListItem: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  return (
    <div className="border border-slate-400 rounded-md p-1 mb-1 flex justify-between">
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
    <div className="fixed inset-10 bg-white rounded-md shadow-lg text-black">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 absolute top-1 right-1"
        onClick={onClose}
      >
        Close
      </button>
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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-700"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
