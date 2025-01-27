import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges class names using tailwind-merge and clsx.
 * 
 * @param inputs - An array of class values to be merged
 * @returns A string of combined and deduped class names
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', 'bg-blue-500', { 'text-white': true })
 * // => "px-2 py-1 bg-blue-500 text-white"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
