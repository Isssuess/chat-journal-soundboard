
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, StickyNote, Image, Video, FilePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import ScrapbookItem, { ScrapbookItemProps } from './ScrapbookItem';
import FileUploadButton from './FileUploadButton';
import { useToast } from '@/hooks/use-toast';

interface ScrapbookManagerProps {
  items: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[];
  onSave: (items: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[]) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ScrapbookManager: React.FC<ScrapbookManagerProps> = ({ items, onSave, containerRef }) => {
  const [scrapbookItems, setScrapbookItems] = useState<Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[]>(items);
  const [selectedColor, setSelectedColor] = useState<string>('yellow');
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [newTextContent, setNewTextContent] = useState<string>('');
  const { toast } = useToast();
  
  const colorOptions = [
    { value: 'yellow', label: 'Yellow', class: 'bg-[#FEF7CD]' },
    { value: 'orange', label: 'Orange', class: 'bg-[#FEC6A1]' },
    { value: 'blue', label: 'Blue', class: 'bg-[#D3E4FD]' },
    { value: 'green', label: 'Green', class: 'bg-[#F2FCE2]' },
    { value: 'pink', label: 'Pink', class: 'bg-[#FFDEE2]' },
    { value: 'purple', label: 'Purple', class: 'bg-[#E5DEFF]' },
    { value: 'cyan', label: 'Cyan', class: 'bg-[#D1F1F9]' },
  ];
  
  useEffect(() => {
    setScrapbookItems(items);
  }, [items]);
  
  useEffect(() => {
    onSave(scrapbookItems);
  }, [scrapbookItems, onSave]);
  
  const getNextZIndex = () => {
    if (scrapbookItems.length === 0) return 1;
    return Math.max(...scrapbookItems.map(item => item.zIndex || 0)) + 1;
  };
  
  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 50, y: 50 };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const padding = 20;
    
    return {
      x: Math.floor(Math.random() * (containerRect.width - 200 - padding * 2) + padding),
      y: Math.floor(Math.random() * (containerRect.height - 200 - padding * 2) + padding)
    };
  };
  
  const addTextNote = () => {
    if (!newTextContent.trim()) {
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
      content: newTextContent,
      position: getRandomPosition(),
      color: selectedColor,
      rotation: Math.floor(Math.random() * 10) - 5,
      zIndex: getNextZIndex()
    };
    
    setScrapbookItems([...scrapbookItems, newItem]);
    setNewTextContent('');
    setIsAddingText(false);
    
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
      position: getRandomPosition(),
      size: { width: 300, height: 'auto' },
      color: selectedColor,
      rotation: Math.floor(Math.random() * 6) - 3,
      zIndex: getNextZIndex() // Fixed: Ensure this is a number
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
      position: getRandomPosition(),
      size: { width: 320, height: 'auto' },
      color: selectedColor,
      rotation: 0, // Videos shouldn't be rotated by default
      zIndex: getNextZIndex() // Fixed: Ensure this is a number
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
      position: getRandomPosition(),
      size: { width: 200, height: 'auto' },
      color: selectedColor,
      rotation: Math.floor(Math.random() * 10) - 5,
      zIndex: getNextZIndex() // Fixed: Ensure this is a number
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
      {/* Scrapbook items */}
      {scrapbookItems.map((item) => (
        <ScrapbookItem
          key={item.id}
          {...item}
          onUpdate={updateItem}
          onDelete={deleteItem}
          onZIndexChange={changeItemZIndex}
        />
      ))}
      
      {/* Add new item buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-2">
        {isAddingText && (
          <div className="bg-white rounded-lg shadow-xl p-4 mb-4 w-72 animate-pop">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Add New Note</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsAddingText(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <Textarea
                placeholder="Write your note here..."
                value={newTextContent}
                onChange={(e) => setNewTextContent(e.target.value)}
                className="min-h-[100px] resize-none"
                autoFocus
              />
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`w-6 h-6 rounded-full ${color.class} ${
                      selectedColor === color.value 
                        ? 'ring-2 ring-offset-2 ring-primary' 
                        : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingText(false)}>
                Cancel
              </Button>
              <Button onClick={addTextNote}>
                Add Note
              </Button>
            </div>
          </div>
        )}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              className="rounded-full h-14 w-14 shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-60">
            <div className="space-y-2">
              <div className="font-medium text-sm">Add new item</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => setIsAddingText(true)}
                >
                  <StickyNote className="h-4 w-4 mr-2" /> Text Note
                </Button>
                
                <FileUploadButton
                  onFileSelect={addImageItem}
                  accept="image/*"
                  tooltip="Upload image"
                  variant="outline"
                  size="default"
                >
                  <span className="ml-2">Image</span>
                </FileUploadButton>
                
                <FileUploadButton
                  onFileSelect={addVideoItem}
                  accept="video/*"
                  tooltip="Upload video"
                  variant="outline"
                  size="default"
                >
                  <Video className="h-4 w-4 mr-2" /> Video
                </FileUploadButton>
                
                <FileUploadButton
                  onFileSelect={addFileItem}
                  accept="*"
                  tooltip="Upload file"
                  variant="outline"
                  size="default"
                >
                  <FilePlus className="h-4 w-4 mr-2" /> File
                </FileUploadButton>
              </div>
              
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-2">Color</div>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`w-6 h-6 rounded-full ${color.class} ${
                        selectedColor === color.value 
                          ? 'ring-2 ring-offset-2 ring-primary' 
                          : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
                      }`}
                      onClick={() => setSelectedColor(color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ScrapbookManager;
