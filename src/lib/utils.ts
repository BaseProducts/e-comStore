import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
if (!BASE_URL) {
  console.warn("⚠️ [Frontend Warning] VITE_API_BASE_URL is missing. API calls may fail.");
}

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});
