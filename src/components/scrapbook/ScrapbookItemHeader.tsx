
import React from 'react';
import { Move, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrapbookItemHeaderProps {
  type: 'text' | 'image' | 'file' | 'video';
  isEditing: boolean;
  onEdit: () => void;
  onRotate: () => void;
  onDelete: () => void;
}

const ScrapbookItemHeader: React.FC<ScrapbookItemHeaderProps> = ({
  type,
  isEditing,
  onEdit,
  onRotate,
  onDelete,
}) => {
  return (
    <div className="flex justify-between items-center p-1 bg-white/50 border-b">
      <Button variant="ghost" size="icon" className="cursor-move h-6 w-6">
        <Move className="h-3 w-3 text-gray-500" />
      </Button>
      
      <div className="flex gap-1">
        {type === 'text' && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={onEdit}
          >
            <Pencil className="h-3 w-3 text-gray-500" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={onRotate}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.25 4.75H14.75V8.25L18.25 4.75H20.75C20.75 4.75 20.75 15.25 20.75 20.75C20.75 21.75 20.25 22.75 18.75 22.75H5.25C3.75 22.75 3.25 21.75 3.25 20.75C3.25 15.25 3.25 4.75 3.25 4.75H5.75L9.25 8.25V4.75Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M13 16C13 17.6569 11.6569 19 10 19C8.34315 19 7 17.6569 7 16C7 14.3431 8.34315 13 10 13C11.6569 13 13 14.3431 13 16Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" 
          onClick={onDelete}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ScrapbookItemHeader;
