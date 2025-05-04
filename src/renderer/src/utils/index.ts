import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// don't worry about the squigly line on context here
const Dateformatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "UTC",
});

export const formatDateFromMS = (ms: number) => Dateformatter.format(ms);

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args));
};
