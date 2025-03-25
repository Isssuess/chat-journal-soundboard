
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { getColorClass } from './scrapbook/ScrapbookItemColors';
import ScrapbookItemHeader from './scrapbook/ScrapbookItemHeader';
import TextContent from './scrapbook/content/TextContent';
import ImageContent from './scrapbook/content/ImageContent';
import VideoContent from './scrapbook/content/VideoContent';
import FileContent from './scrapbook/content/FileContent';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag handling functions
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
  
  // Content update handlers
  const handleSaveContent = (editedContent: string) => {
    onUpdate(id, { content: editedContent });
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleRotate = () => {
    const newRotation = (rotation || 0) + 5;
    onUpdate(id, { rotation: newRotation });
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
  
  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <TextContent
            content={content}
            isEditing={isEditing}
            onSave={handleSaveContent}
            onCancel={handleCancelEdit}
          />
        );
      case 'image':
        return (
          <ImageContent
            content={content}
            onChangeFile={() => fileInputRef.current?.click()}
          />
        );
      case 'video':
        return (
          <VideoContent
            content={content}
            onChangeFile={() => fileInputRef.current?.click()}
          />
        );
      case 'file':
        return (
          <FileContent
            content={content}
            onChangeFile={() => fileInputRef.current?.click()}
          />
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
      
      <ScrapbookItemHeader
        type={type}
        isEditing={isEditing}
        onEdit={() => setIsEditing(!isEditing)}
        onRotate={handleRotate}
        onDelete={() => onDelete(id)}
      />
      
      {renderContent()}
    </div>
  );
};

export default ScrapbookItem;
