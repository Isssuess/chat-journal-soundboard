
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import ScrapbookItemsList from './scrapbook/ScrapbookItemsList';
import ScrapbookAddItemButton from './scrapbook/ScrapbookAddItemButton';
import { getNextZIndex, getRandomPosition, colorOptions } from './scrapbook/ScrapbookUtils';
import { ScrapbookItemProps } from './ScrapbookItem';

interface ScrapbookManagerProps {
  items: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[];
  onSave: (items: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[]) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ScrapbookManager: React.FC<ScrapbookManagerProps> = ({ items, onSave, containerRef }) => {
  const [scrapbookItems, setScrapbookItems] = useState<Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[]>(items);
  const [selectedColor, setSelectedColor] = useState<string>('yellow');
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setScrapbookItems(items);
  }, [items]);
  
  useEffect(() => {
    onSave(scrapbookItems);
  }, [scrapbookItems, onSave]);
  
  const addTextNote = (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Cannot add empty note",
        description: "Please write something in your note",
        variant: "destructive"
      });
      return;
    }
    
    const newItem: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'> = {
      id: uuidv4(),
      type: 'text',
      content: content,
      position: getRandomPosition(containerRef),
      color: selectedColor,
      rotation: Math.floor(Math.random() * 10) - 5,
      zIndex: getNextZIndex(scrapbookItems)
    };
    
    setScrapbookItems([...scrapbookItems, newItem]);
    
    toast({
      title: "Note added",
      description: "Your note has been added to the scrapbook"
    });
  };
  
  const addImageItem = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    
    const newItem: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'> = {
      id: uuidv4(),
      type: 'image',
      content: imageUrl,
      position: getRandomPosition(containerRef),
      size: { width: 300, height: 'auto' },
      color: selectedColor,
      rotation: Math.floor(Math.random() * 6) - 3,
      zIndex: getNextZIndex(scrapbookItems)
    };
    
    setScrapbookItems([...scrapbookItems, newItem]);
    
    toast({
      title: "Image added",
      description: "Your image has been added to the scrapbook"
    });
  };
  
  const addVideoItem = (file: File) => {
    const videoUrl = URL.createObjectURL(file);
    
    const newItem: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'> = {
      id: uuidv4(),
      type: 'video',
      content: videoUrl,
      position: getRandomPosition(containerRef),
      size: { width: 320, height: 'auto' },
      color: selectedColor,
      rotation: 0, // Videos shouldn't be rotated by default
      zIndex: getNextZIndex(scrapbookItems)
    };
    
    setScrapbookItems([...scrapbookItems, newItem]);
    
    toast({
      title: "Video added",
      description: "Your video has been added to the scrapbook"
    });
  };
  
  const addFileItem = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    
    const newItem: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'> = {
      id: uuidv4(),
      type: 'file',
      content: file.name,
      position: getRandomPosition(containerRef),
      size: { width: 200, height: 'auto' },
      color: selectedColor,
      rotation: Math.floor(Math.random() * 10) - 5,
      zIndex: getNextZIndex(scrapbookItems)
    };
    
    setScrapbookItems([...scrapbookItems, newItem]);
    
    toast({
      title: "File added",
      description: `"${file.name}" has been added to the scrapbook`
    });
  };
  
  const updateItem = (id: string, data: Partial<Omit<ScrapbookItemProps, 'id' | 'onUpdate' | 'onDelete' | 'onZIndexChange'>>) => {
    setScrapbookItems(items => 
      items.map(item => 
        item.id === id ? { ...item, ...data } : item
      )
    );
  };
  
  const deleteItem = (id: string) => {
    setScrapbookItems(items => items.filter(item => item.id !== id));
    
    toast({
      title: "Item deleted",
      description: "The item has been removed from your scrapbook"
    });
  };
  
  const changeItemZIndex = (id: string, zIndex: number) => {
    setScrapbookItems(items => 
      items.map(item => 
        item.id === id ? { ...item, zIndex } : item
      )
    );
  };
  
  return (
    <div className="relative h-full">
      <ScrapbookItemsList 
        items={scrapbookItems}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
        onChangeItemZIndex={changeItemZIndex}
      />
      
      <ScrapbookAddItemButton
        isAddingText={isAddingText}
        setIsAddingText={setIsAddingText}
        onAddTextNote={addTextNote}
        onAddImage={addImageItem}
        onAddVideo={addVideoItem}
        onAddFile={addFileItem}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        colorOptions={colorOptions}
      />
    </div>
  );
};

export default ScrapbookManager;
