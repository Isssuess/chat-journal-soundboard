
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
  rotation?: number;
  zIndex: number;
}

export interface ScrapbookItem {
  id: string;
  type: 'text' | 'image' | 'file' | 'video';
  content: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  color: string;
  rotation?: number;
  zIndex: number;
}

export interface JournalEntry {
  date: string;
  content: string[];
  lastUpdated: string;
  attachments?: {
    type: "image" | "file" | "video";
    url: string;
    name: string;
  }[];
  scrapbookItems?: ScrapbookItem[];
}

export const getJournalPrompts = () => {
  const prompts = [
    "What made you smile today?",
    "What's one thing you learned recently?",
    "Describe your current mood in detail.",
    "What's something you're looking forward to?",
    "What's a challenge you're facing right now?",
    "What are you grateful for today?",
    "Describe a recent interaction that affected you.",
    "What's something you'd like to improve about yourself?",
    "What's a goal you're working towards?",
    "Reflect on a decision you made recently.",
    "What's something that surprised you lately?",
    "What's a memory that made you happy today?",
    "What's something you're proud of?",
    "What's a worry you can let go of?",
    "What's giving you hope right now?",
    "What would make tomorrow great?",
    "What's something you want to remember about today?",
    "How did you take care of yourself today?",
    "What's something you accomplished today?",
    "What's a thought that's been on your mind lately?",
  ];
  
  const shuffled = [...prompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export const getRandomNoteColor = () => {
  const colors = [
    'yellow',
    'orange',
    'blue',
    'green',
    'pink',
    'purple',
    'cyan',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const createDefaultScrapbookItem = (
  type: 'text' | 'image' | 'file' | 'video', 
  content: string,
  position: { x: number, y: number },
  zIndex: number = 1
): ScrapbookItem => {
  return {
    id: uuidv4(),
    type,
    content,
    position,
    color: getRandomNoteColor(),
    rotation: Math.floor(Math.random() * 10) - 5,
    zIndex
  };
};

export const getNextZIndex = (items: ScrapbookItem[]) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.zIndex)) + 1;
};
