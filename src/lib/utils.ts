import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeconds(seconds: number) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  let formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  let formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

  return `${formattedMinutes}:${formattedSeconds}`;
}
