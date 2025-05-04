import { Xbutton } from "@/components/Button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cn } from "@renderer/utils";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
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
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// Create a Jotai atom to share the API key across components
export const geminiApiKeyAtom = atom<string>("");

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
  error,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  iconAriaLabel?: string;
  className?: string;
  error?: string | null;
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
          error && "border-red-500/70 focus:ring-red-500/50",
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
      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {error}
        </p>
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

  // Use local state for form values instead of directly using the atom
  const [geminiApiKey, setGeminiApiKey] = useAtom(geminiApiKeyAtom);
  // Local state for the form input
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [backdrop, setBackdrop] = useState("none");
  const [isSavedAnimate, setIsSavedAnimate] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [zenModeShortcut, setZenModeShortcut] = useState("F11");
  const [shortcutError, setShortcutError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [validatingApiKey, setValidatingApiKey] = useState(false);

  // Track if settings have changed
  const [settingsChanged, setSettingsChanged] = useState(false);

  const initialLoadComplete = useRef(false);
  const hasRendered = useRef(false);

  // Debounce API key validation
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const backdropOptions = [
    { value: "mica", label: "Mica" },
    { value: "acrylic", label: "Acrylic (blur on Win11)" },
    { value: "none", label: "None" },
    { value: "tabbed", label: "Tabbed" },
    { value: "auto", label: "Auto" },
  ];

  // Function to validate Gemini API key
  const validateApiKey = useCallback(async (apiKey: string) => {
    if (!apiKey) {
      setApiKeyError(null);
      return;
    }

    setValidatingApiKey(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Try a very minimal prompt just to validate the key
      await model.generateContent("Hello");

      // If we reach here, the key is valid
      setApiKeyError(null);
    } catch (error) {
      console.error("API key validation error:", error);
      if (error instanceof Error) {
        const errorText = error.message.toLowerCase();
        if (
          errorText.includes("api key") ||
          errorText.includes("authentication") ||
          errorText.includes("unauthorized") ||
          errorText.includes("invalid key")
        ) {
          setApiKeyError("Invalid API key. Please check and try again.");
        } else if (
          errorText.includes("network") ||
          errorText.includes("connection")
        ) {
          setApiKeyError(
            "Network error. Please check your internet connection.",
          );
        } else {
          setApiKeyError("Error validating API key. Please try again.");
        }
      } else {
        setApiKeyError("Unknown error validating API key.");
      }
    } finally {
      setValidatingApiKey(false);
    }
  }, []);

  const showSaveAnimation = () => {
    setIsSavedAnimate(true);
    setTimeout(() => {
      setIsSavedAnimate(false); // Hide checkmark after 2 seconds
    }, 2000);
  };

  // Create a save function
  const saveSettings = useCallback(async () => {
    if (settingsChanged) {
      // Don't save if there's an API key error
      if (apiKeyError && geminiKeyInput) {
        return;
      }

      const newSettings = {
        geminiApi: geminiKeyInput,
        language: "en",
        backgroundMaterial: backdrop,
        zenModeShortcut: zenModeShortcut,
      };

      await window.context.saveSettings(newSettings);
      console.log("Settings saved:", newSettings);
      showSaveAnimation();

      // Update the atom for the API key
      setGeminiApiKey(geminiKeyInput);

      // Reset changed flag
      setSettingsChanged(false);
    }
  }, [
    geminiKeyInput,
    backdrop,
    zenModeShortcut,
    settingsChanged,
    setGeminiApiKey,
    apiKeyError,
  ]);

  // Custom onClose handler that saves settings before closing
  const handleClose = useCallback(() => {
    saveSettings();
    onClose();
  }, [saveSettings, onClose]);

  // Function to apply background material
  const applyBackgroundMaterial = useCallback(async (material) => {
    try {
      const result = await window.context.applyBackgroundMaterial(material);
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
  }, []);

  // Function to update zen mode shortcut
  const updateZenModeShortcut = useCallback(async (shortcut) => {
    try {
      const shortcutResult =
        await window.context.updateZenModeShortcut(shortcut);
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
  }, []);

  // Load settings on initial render (once)
  useEffect(() => {
    const fetchSettings = async () => {
      if (!hasRendered.current) {
        hasRendered.current = true;
        const settings = await window.context.getSettings();
        setGeminiKeyInput(settings.geminiApi || "");
        setBackdrop(settings.backgroundMaterial || "none");
        setZenModeShortcut(settings.zenModeShortcut || "F11");
        initialLoadComplete.current = true;
      }
    };
    fetchSettings();
  }, []); // Empty dependency array means this runs only once

  // Handle API key input changes
  const handleApiKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKey = e.target.value;
      setGeminiKeyInput(newKey);
      setSettingsChanged(true);

      // Clear previous timeout
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }

      // Debounce validation to avoid too many API calls
      if (newKey.trim()) {
        validationTimeoutRef.current = setTimeout(() => {
          validateApiKey(newKey);
        }, 800);
      } else {
        setApiKeyError(null);
      }
    },
    [validateApiKey],
  );

  // Handle backdrop changes
  const handleBackdropChange = useCallback(
    (value: string) => {
      setBackdrop(value);
      setSettingsChanged(true);
      applyBackgroundMaterial(value);
    },
    [applyBackgroundMaterial],
  );

  // Handle zen mode shortcut changes
  const handleShortcutChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setZenModeShortcut(e.target.value);
      setSettingsChanged(true);
      updateZenModeShortcut(e.target.value);
    },
    [updateZenModeShortcut],
  );

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
          onClick={handleClose}
          aria-label="Close Preferences"
          className="border border-slate-600/40 hover:bg-slate-700/70"
        />

        <div className="flex items-center justify-center mb-6 mt-2">
          <SettingsIcon className="h-6 w-6 text-slate-400 mr-2" />
          <h2 className="text-xl font-medium text-slate-200">Preferences</h2>
        </div>

        <div className="overflow-y-auto pr-2 max-h-[calc(100vh-220px)] scrollbar-thin">
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
              onChange={handleBackdropChange}
              options={backdropOptions}
            />
          </PrefListItem>
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
              onChange={handleApiKeyChange}
              type={showApiKey ? "text" : "password"}
              placeholder="Paste your API key"
              icon={showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              onIconClick={() => setShowApiKey(!showApiKey)}
              iconAriaLabel={showApiKey ? "Hide API key" : "Show API key"}
              className="w-60"
              error={apiKeyError}
            />
            {validatingApiKey && (
              <div className="text-xs text-blue-400 mt-1">
                Validating API key...
              </div>
            )}
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
              onChange={handleShortcutChange}
              placeholder="Enter shortcut"
              className="w-60"
            />
          </PrefListItem>
        </div>

        <div className="flex justify-center mt-6 pt-4 border-t border-slate-700/50">
          {apiKeyError && (
            <div className="text-red-400 text-sm flex items-center mr-4">
              <AlertTriangle className="mr-1.5 h-4 w-4" />
              Unable to save with invalid API key
            </div>
          )}
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
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <Check className="text-green-500 w-5 h-5" />
                <span>Preferences saved</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
