import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines one or more class value inputs into a single, optimized class string.
 *
 * Accepts class names, arrays, objects, and other ClassValue forms and produces a
 * space-separated string with conflicting Tailwind utility classes merged and duplicate
 * tokens removed.
 *
 * @param inputs - One or more class values (strings, arrays, objects, etc.) to combine
 * @returns The merged class string with conflicts resolved and duplicates eliminated
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}