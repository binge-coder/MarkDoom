import { PropsWithChildren } from "react";
import React, { useState, useEffect } from "react";
import { Xbutton } from "@/components/Button";
import { GenericButton } from "@/components";

const PrefListItem: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  return (
    <div
      className="border border-slate-400 rounded-md py-2 px-2 mb-1 flex justify-between "
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
    <div className="fixed inset-10 bg-black/90 border border-slate-800/90 rounded-md shadow-lg text-white p-2 border-black backdrop-blur">
      <Xbutton onClick={onClose}></Xbutton>
      <h2 className="text-lg font-bold my-4 ml-4">Preferences</h2>
      <div className="m-4">
        <PrefListItem>
          <div className="flex items-center">Your Gemini API key:</div>
          <input
            type="text"
            placeholder="paste your key"
            value={geminiKeyInput}
            onChange={handleApiInput}
            className="border border-black min-w-96 p-1 text-black rounded bg-slate-200 focus:outline-black"
          />
        </PrefListItem>
        <div className="flex justify-center">
          <GenericButton
            onClick={handleSave}
            className="border border-slate-400"
          >
            Save Preferences
          </GenericButton>
        </div>
      </div>
    </div>
  );
};
