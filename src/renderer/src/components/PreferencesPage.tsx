import { Xbutton } from "@/components/Button";
import { cn } from "@renderer/utils";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
} from "lucide-react";
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";

interface PrefListItemProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
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
  icon,
  ...props
}) => {
  return (
    <div
      className="border border-slate-600/30 bg-slate-800/20 hover:bg-slate-800/30 rounded-lg py-4 px-5 mb-5 flex items-center justify-between transition-all duration-200 shadow-sm"
      {...props}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="text-slate-400 mt-1">{icon}</div>}
        <div className="flex flex-col">
          <div className="font-medium text-slate-100 mb-0.5">{title}</div>
          {subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}
        </div>
      </div>
      <div className="flex-shrink-0 ml-4">{children}</div>
    </div>
  );
};

// Custom dropdown select component
const CustomSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-60 px-4 py-2 bg-slate-700/70 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/30 hover:bg-slate-700/90 transition-colors duration-200 shadow-sm"
      >
        <span>
          {options.find((opt) => opt.value === value)?.label || value}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-slate-400 transition-transform duration-200",
            isOpen && "transform rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-1 w-full bg-slate-800 border border-slate-600/50 rounded-lg overflow-hidden shadow-lg z-10"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 hover:bg-slate-700 transition-colors duration-150",
                value === option.value
                  ? "bg-slate-700/70 text-white"
                  : "text-slate-300",
              )}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Custom input component
const CustomInput = ({
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  onIconClick,
  iconAriaLabel,
  className,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  iconAriaLabel?: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-2.5 bg-slate-700/70 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50 hover:bg-slate-700/90 transition-colors duration-200 shadow-sm overflow-x-auto",
          icon && "pr-10", // Add padding on the right when icon is present
        )}
      />
      {icon && (
        <button
          type="button"
          onClick={onIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors duration-150"
          aria-label={iconAriaLabel}
        >
          {icon}
        </button>
      )}
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
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [backdrop, setBackdrop] = useState("none");
  const [isSavedAnimate, setIsSavedAnimate] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [zenModeShortcut, setZenModeShortcut] = useState("F11");
  const [shortcutError, setShortcutError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const backdropOptions = [
    { value: "mica", label: "Mica" },
    { value: "acrylic", label: "Acrylic (blur on Win11)" },
    { value: "none", label: "None" },
    { value: "tabbed", label: "Tabbed" },
    { value: "auto", label: "Auto" },
  ];

  const savePreferencesAnimatefn = () => {
    setIsSavedAnimate(true);
    setTimeout(() => {
      setIsSavedAnimate(false); // Hide checkmark after 2 seconds
    }, 2000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await window.context.getSettings(); // Fetch the settings
      setGeminiKeyInput(settings.geminiApi || ""); // Set the Gemini API key
      setBackdrop(settings.backgroundMaterial || "none");
      setZenModeShortcut(settings.zenModeShortcut || "F11");
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const newSettings = {
      geminiApi: geminiKeyInput,
      language: "en",
      backgroundMaterial: backdrop,
      zenModeShortcut: zenModeShortcut,
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

    // Apply the Zen Mode shortcut
    try {
      const shortcutResult =
        await window.context.updateZenModeShortcut(zenModeShortcut);
      if (!shortcutResult.success) {
        setShortcutError(
          "Failed to register shortcut. It may be in use by another application.",
        );
      } else {
        setShortcutError(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      setShortcutError(`Error: ${error}`);
    }

    savePreferencesAnimatefn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative w-full max-w-3xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl p-6 overflow-hidden mx-4"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40"></div>

        <Xbutton
          onClick={onClose}
          aria-label="Close Preferences"
          className="border border-slate-600/40 hover:bg-slate-700/70"
        />

        <div className="flex items-center justify-center mb-6 mt-2">
          <SettingsIcon className="h-6 w-6 text-slate-400 mr-2" />
          <h2 className="text-xl font-medium text-slate-200">Preferences</h2>
        </div>

        <div className="overflow-y-auto pr-2 max-h-[calc(100vh-220px)] scrollbar-thin">
          <PrefListItem
            title="Gemini API Key"
            subtitle={
              <>
                Connect your AI assistant by adding a Gemini API key from{" "}
                <a
                  className="text-blue-400 hover:text-blue-300 underline"
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google AI Studio
                </a>
              </>
            }
          >
            <CustomInput
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
              type={showApiKey ? "text" : "password"}
              placeholder="Paste your API key"
              icon={showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              onIconClick={() => setShowApiKey(!showApiKey)}
              iconAriaLabel={showApiKey ? "Hide API key" : "Show API key"}
              className="w-60"
            />
          </PrefListItem>

          <PrefListItem
            title="Window Backdrop Effect"
            subtitle={
              <>
                <p>Choose the visual style for your application window</p>
                {applyError && (
                  <p className="text-red-400 flex items-center mt-1.5">
                    <AlertTriangle className="mr-1.5 h-4 w-4" /> {applyError}
                  </p>
                )}
                {debugInfo && debugInfo.success && (
                  <div className="text-xs mt-1.5 text-slate-500">
                    Applied: {debugInfo.appliedMaterial}
                  </div>
                )}
              </>
            }
          >
            <CustomSelect
              value={backdrop}
              onChange={setBackdrop}
              options={backdropOptions}
            />
          </PrefListItem>

          <PrefListItem
            title="Zen Mode Shortcut"
            subtitle={
              <>
                <p>Set your keyboard shortcut for toggling Zen Mode</p>
                <p className="text-amber-300/80 text-xs mt-1.5 flex items-center">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded mr-1.5">
                    +
                  </span>
                  Use plus sign between keys (e.g.{" "}
                  <span className="font-mono bg-slate-800 mx-1 px-1.5 py-0.5 rounded">
                    ctrl+shift+z
                  </span>{" "}
                  or{" "}
                  <span className="font-mono bg-slate-800 mx-1 px-1.5 py-0.5 rounded">
                    f11
                  </span>
                  )
                </p>
                {shortcutError && (
                  <p className="text-red-400 flex items-center mt-1.5">
                    <AlertTriangle className="mr-1.5 h-4 w-4" /> {shortcutError}
                  </p>
                )}
              </>
            }
          >
            <CustomInput
              value={zenModeShortcut}
              onChange={(e) => setZenModeShortcut(e.target.value)}
              placeholder="Enter shortcut"
              className="w-60"
            />
          </PrefListItem>
        </div>

        <div className="flex justify-center mt-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600/40 rounded-lg text-slate-200 font-medium transition-colors duration-200 shadow-sm flex items-center justify-center min-w-[140px]"
          >
            Save Preferences
          </button>
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
              <Check className="text-green-500 w-6 h-6 ml-3" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
