import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleError(error: unknown) {
  console.error(error);

  let errorMessage: string;

  // Check if the error is an instance of Error
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    try {
      errorMessage = JSON.stringify(error);
    } catch (jsonError) {
      errorMessage = 'An unknown error occurred';
    }
  }

  throw new Error(errorMessage);
}
