// import React from 'react';
import { PropsWithChildren } from "react";
import React, { useState } from "react";

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
  //   const savedValue = window.settings.get("geminiApiKey");
  //   const geminiApi = savedValue || "";
  const [geminiKeyInput, setgeminiKeyInput] = useState("");

  const handleApiInput = (e) => {
    setgeminiKeyInput(e.target.value);
    // window.settings.set("geminiApiKey", e.target.value);
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
      </div>
    </div>
  );
};
