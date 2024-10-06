import { PropsWithChildren, ReactNode } from "react";
import React, { useState, useEffect } from "react";
import { Xbutton } from "@/components/Button";
import { GenericButton } from "@/components";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { Lorem } from "./Lorem";

interface PrefListItemProps {
  title: string;
  subtitle?: ReactNode;
}

const PrefListItem: React.FC<PropsWithChildren<PrefListItemProps>> = ({
  children,
  title,
  subtitle,
  ...props
}) => {
  return (
    <div
      className="border border-slate-400 rounded-md py-2 px-2 mb-2 flex justify-between"
      {...props}
    >
      <div className="flex flex-col">
        <div>{title}</div>
        {subtitle && <div className="text-sm">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
};

type PreferencesPageProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const PreferencesPage: React.FC<PreferencesPageProps> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;
  const [geminiKeyInput, setgeminiKeyInput] = useState("");
  const [backdrop, setBackdrop] = useState("none");
  const [isSavedAnimate, setIsSavedAnimate] = useState(false);

  const savePreferencesAnimatefn = () => {
    setIsSavedAnimate(true);
    setTimeout(() => {
      setIsSavedAnimate(false); // Hide tickmark after 2 seconds
    }, 2000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await window.context.getSettings(); // Fetch the settings
      setgeminiKeyInput(settings.geminiApi || ""); // Set the Gemini API key
      setBackdrop(settings.backgroundMaterial || "none");
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const newSettings = {
      geminiApi: geminiKeyInput,
      language: "en",
      backgroundMaterial: backdrop,
    }; // Update the settings
    await window.context.saveSettings(newSettings); // Save the settings
    console.log("Settings saved.");
    savePreferencesAnimatefn();
  };

  return (
    <div className="fixed inset-10 bg-black border border-slate-400 rounded-md shadow-lg text-white p-2 z-30 ">
      <Xbutton
        onClick={onClose}
        aria-label="Close Preferences"
        className="border border-slate-400"
      ></Xbutton>
      <h2 className="text-lg font-bold my-4 ml-4">Preferences</h2>
      <div className="mx-4 max-h-full overflow-y-auto h-4/5 pb-1 px-1">
        <PrefListItem
          title="Your Gemini API key (optional):"
          subtitle={
            <>
              Get yours from{" "}
              <a
                className="text-blue-500 underline"
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </>
          }
        >
          <input
            type="text"
            placeholder="paste your key"
            value={geminiKeyInput}
            onChange={(e) => setgeminiKeyInput(e.target.value)}
            className="min-w-96 p-1 text-black rounded bg-slate-200 "
          />
        </PrefListItem>

        <PrefListItem
          title="Enter window backdrop: "
          subtitle={<p>Restart the app to apply changes.</p>}
        >
          <div>
            <select
              className="text-black p-1 rounded bg-slate-200 "
              value={backdrop}
              onChange={(e) => setBackdrop(e.target.value)}
            >
              {/* <option value="mica">Mica</option> */}
              <option value="acrylic">Acrylic (blur on win11)</option>
              <option value="none">None</option>
              {/* <option value="tabbed">Tabbed</option> */}
            </select>
          </div>
        </PrefListItem>

        {/* <Lorem /> */}
      </div>

      <div className="flex justify-center">
        <GenericButton onClick={handleSave} className="border border-slate-400">
          Save Preferences
        </GenericButton>
        {isSavedAnimate && (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 10,
                duration: 0.5,
              },
            }}
          >
            <FaCheck className="text-green-500 w-7 h-7 ml-2" />
          </motion.div>
        )}
      </div>
    </div>
  );
};
