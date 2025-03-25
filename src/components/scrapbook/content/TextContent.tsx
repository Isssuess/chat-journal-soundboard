
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextContentProps {
  content: string;
  isEditing: boolean;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const TextContent: React.FC<TextContentProps> = ({
  content,
  isEditing,
  onSave,
  onCancel,
}) => {
  const [editContent, setEditContent] = useState(content);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
  };

  if (isEditing) {
    return (
      <div className="p-2 w-full">
        <Textarea
          value={editContent}
          onChange={handleContentChange}
          className="min-h-[100px] bg-transparent border-0 focus:ring-0 resize-none p-0"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(editContent)}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 whitespace-pre-wrap text-gray-700">
      {content}
    </div>
  );
};

export default TextContent;
