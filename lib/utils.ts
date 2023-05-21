import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getRapidAPiKey() {
  return process.env.NEXT_RAPIDAPI_KEY;
}
