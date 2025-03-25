
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ColorSelector, { ColorOption } from './ColorSelector';

interface TextNoteFormProps {
  onAddNote: (content: string, color: string) => void;
  onCancel: () => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  colorOptions: ColorOption[];
}

const TextNoteForm: React.FC<TextNoteFormProps> = ({
  onAddNote,
  onCancel,
  selectedColor,
  onColorChange,
  colorOptions,
}) => {
  const [noteContent, setNoteContent] = useState<string>('');
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Cannot add empty note",
        description: "Please write something in your note",
        variant: "destructive"
      });
      return;
    }
    
    onAddNote(noteContent, selectedColor);
    setNoteContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 mb-4 w-72 animate-pop">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Add New Note</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <Textarea
          placeholder="Write your note here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px] resize-none"
          autoFocus
        />
      </div>
      
      <div className="mb-4">
        <ColorSelector 
          colorOptions={colorOptions}
          selectedColor={selectedColor}
          onColorChange={onColorChange}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleAddNote}>
          Add Note
        </Button>
      </div>
    </div>
  );
};

export default TextNoteForm;
