
import { ScrapbookItemProps } from '../ScrapbookItem';

export const getNextZIndex = (items: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[]) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.zIndex || 0)) + 1;
};

export const getRandomPosition = (containerRef: React.RefObject<HTMLDivElement>) => {
  if (!containerRef.current) return { x: 50, y: 50 };
  
  const containerRect = containerRef.current.getBoundingClientRect();
  const padding = 20;
  
  return {
    x: Math.floor(Math.random() * (containerRect.width - 200 - padding * 2) + padding),
    y: Math.floor(Math.random() * (containerRect.height - 200 - padding * 2) + padding)
  };
};

export const colorOptions = [
  { value: 'yellow', label: 'Yellow', class: 'bg-[#FEF7CD]' },
  { value: 'orange', label: 'Orange', class: 'bg-[#FEC6A1]' },
  { value: 'blue', label: 'Blue', class: 'bg-[#D3E4FD]' },
  { value: 'green', label: 'Green', class: 'bg-[#F2FCE2]' },
  { value: 'pink', label: 'Pink', class: 'bg-[#FFDEE2]' },
  { value: 'purple', label: 'Purple', class: 'bg-[#E5DEFF]' },
  { value: 'cyan', label: 'Cyan', class: 'bg-[#D1F1F9]' },
];
