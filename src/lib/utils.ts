import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});
