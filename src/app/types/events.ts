// types.ts
export type Event = {
    name: string;
    start: number;
    finish: number;
    duration: number;
    color: string;
    originalColor: string;
    latitude?: number;
    longitude?: number;
    meaning?: string;
    bibleText?: string;
    place?: string;
    additionalInfo?: string;
    references?: string[];
  };
  