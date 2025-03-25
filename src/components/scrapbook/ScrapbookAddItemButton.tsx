
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddItemMenu from './AddItemMenu';
import TextNoteForm from './TextNoteForm';
import { ColorOption } from './ColorSelector';

interface ScrapbookAddItemButtonProps {
  isAddingText: boolean;
  setIsAddingText: (isAdding: boolean) => void;
  onAddTextNote: (content: string) => void;
  onAddImage: (file: File) => void;
  onAddVideo: (file: File) => void;
  onAddFile: (file: File) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  colorOptions: ColorOption[];
}

const ScrapbookAddItemButton: React.FC<ScrapbookAddItemButtonProps> = ({
  isAddingText,
  setIsAddingText,
  onAddTextNote,
  onAddImage,
  onAddVideo,
  onAddFile,
  selectedColor,
  setSelectedColor,
  colorOptions,
}) => {
  const handleAddNote = (content: string) => {
    onAddTextNote(content);
    setIsAddingText(false);
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-2">
      {isAddingText && (
        <TextNoteForm
          onAddNote={handleAddNote}
          onCancel={() => setIsAddingText(false)}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          colorOptions={colorOptions}
        />
      )}
      
      <AddItemMenu
        onAddTextNote={() => setIsAddingText(true)}
        onAddImage={onAddImage}
        onAddVideo={onAddVideo}
        onAddFile={onAddFile}
        colorOptions={colorOptions}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
    </div>
  );
};

export default ScrapbookAddItemButton;
