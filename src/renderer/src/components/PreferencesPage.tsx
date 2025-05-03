import { GenericButton } from "@/components";
import { Xbutton } from "@/components/Button";
import { motion } from "framer-motion";
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { FaCheck, FaTriangleExclamation } from "react-icons/fa6";

interface PrefListItemProps {
  title: string;
  subtitle?: ReactNode;
}

// Define type for debug info
interface DebugInfo {
  success: boolean;
  appliedMaterial?: string;
  error?: string;
  currentSettings?: {
    backgroundColor?: string;
  };
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
  const [applyError, setApplyError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

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

    // Apply background material immediately
    try {
      const result = await window.context.applyBackgroundMaterial(backdrop);
      if (!result.success) {
        setApplyError(`Failed to apply: ${result.error}`);
      } else {
        setApplyError(null);
        setDebugInfo(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      setApplyError(`Error: ${error}`);
    }

    savePreferencesAnimatefn();
  };

  const handleBackdropChange = async (value: string) => {
    setBackdrop(value);
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
          subtitle={
            <>
              <p>Changes will now apply immediately when saving.</p>
              {applyError && (
                <p className="text-red-400 flex items-center mt-1">
                  <FaTriangleExclamation className="mr-1" /> {applyError}
                </p>
              )}
              {debugInfo && debugInfo.success && (
                <div className="text-xs mt-1 text-gray-400">
                  Applied: {debugInfo.appliedMaterial}
                  {debugInfo.currentSettings && (
                    <div>
                      <div>
                        Background: {debugInfo.currentSettings.backgroundColor}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          }
        >
          <div>
            <select
              className="text-black p-1 rounded bg-slate-200 "
              value={backdrop}
              onChange={(e) => handleBackdropChange(e.target.value)}
            >
              <option value="mica">Mica</option>
              <option value="acrylic">Acrylic (blur on win11)</option>
              <option value="none">None</option>
              <option value="tabbed">Tabbed</option>
              <option value="auto">Auto</option>
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
