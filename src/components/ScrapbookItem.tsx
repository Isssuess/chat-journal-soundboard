
import React, { useRef, useState } from 'react';
import { X, Move, Pencil, Image, FilePlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface ScrapbookItemProps {
  id: string;
  type: 'text' | 'image' | 'file' | 'video';
  content: string;
  position: { x: number; y: number };
  size?: { width: number; height: number };
  color: string;
  rotation?: number;
  zIndex: number;
  onUpdate: (id: string, data: Partial<Omit<ScrapbookItemProps, 'id' | 'onUpdate' | 'onDelete'>>) => void;
  onDelete: (id: string) => void;
  onZIndexChange: (id: string, zIndex: number) => void;
}

const colorVariants = {
  yellow: 'bg-[#FEF7CD] border-[#F5D76E]',
  orange: 'bg-[#FEC6A1] border-[#E67E22]',
  blue: 'bg-[#D3E4FD] border-[#3498DB]',
  green: 'bg-[#F2FCE2] border-[#2ECC71]',
  pink: 'bg-[#FFDEE2] border-[#E91E63]',
  purple: 'bg-[#E5DEFF] border-[#9B59B6]',
  cyan: 'bg-[#D1F1F9] border-[#1ABC9C]',
};

const getColorClass = (color: string) => {
  return colorVariants[color as keyof typeof colorVariants] || colorVariants.yellow;
};

const ScrapbookItem: React.FC<ScrapbookItemProps> = ({
  id,
  type,
  content,
  position,
  size = { width: 200, height: 'auto' },
  color,
  rotation = 0,
  zIndex,
  onUpdate,
  onDelete,
  onZIndexChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onZIndexChange(id, 9999); // Bring to front while dragging
  };
  
  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    onUpdate(id, {
      position: {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
    });
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    onZIndexChange(id, zIndex); // Restore original z-index
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
  };
  
  const handleSave = () => {
    onUpdate(id, { content: editContent });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }
    
    const fileUrl = URL.createObjectURL(file);
    onUpdate(id, { content: fileUrl });
  };
  
  const handleRotate = () => {
    const newRotation = (rotation || 0) + 5;
    onUpdate(id, { rotation: newRotation });
  };
  
  const renderContent = () => {
    if (isEditing && type === 'text') {
      return (
        <div className="p-2 w-full">
          <Textarea
            value={editContent}
            onChange={handleContentChange}
            className="min-h-[100px] bg-transparent border-0 focus:ring-0 resize-none p-0"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      );
    }
    
    switch (type) {
      case 'text':
        return (
          <div className="p-4 whitespace-pre-wrap text-gray-700">
            {content}
          </div>
        );
      case 'image':
        return (
          <div className="relative">
            <img
              src={content}
              alt="Scrapbook item"
              className="w-full h-auto object-contain rounded-md max-h-[300px]"
            />
            {!content.startsWith('http') && (
              <Button
                size="sm"
                className="absolute bottom-2 right-2 bg-white/70 text-black hover:bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-1" /> Change
              </Button>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="relative">
            <video
              src={content}
              controls
              className="w-full h-auto rounded-md max-h-[300px]"
            />
            {!content.startsWith('http') && (
              <Button
                size="sm"
                className="absolute bottom-2 right-2 bg-white/70 text-black hover:bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-1" /> Change
              </Button>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="p-4 flex flex-col items-center justify-center">
            <FilePlus className="h-12 w-12 text-gray-500 mb-2" />
            <span className="text-sm text-gray-700 text-center break-all">
              {content.split('/').pop() || 'Attached file'}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              Change File
            </Button>
          </div>
        );
      default:
        return <div>Unknown content type</div>;
    }
  };
  
  return (
    <div 
      className={cn(
        "absolute select-none shadow-lg rounded-md overflow-hidden transition-transform",
        getColorClass(color),
        isDragging ? "shadow-xl cursor-grabbing" : "cursor-grab hover:shadow-xl",
        "border-t-4"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: typeof size.width === 'number' ? `${size.width}px` : size.width,
        height: typeof size.height === 'number' ? `${size.height}px` : size.height,
        transform: `rotate(${rotation}deg)`,
        zIndex: isDragging ? 9999 : zIndex,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="sr-only"
        accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : undefined}
        onChange={handleFileSelect}
      />
      
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
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="h-3 w-3 text-gray-500" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleRotate}
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
            onClick={() => onDelete(id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default ScrapbookItem;
