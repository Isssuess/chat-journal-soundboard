
import React from 'react';
import { StickyNote, Image, Video, FilePlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import FileUploadButton from '../FileUploadButton';
import ColorSelector, { ColorOption } from './ColorSelector';

interface AddItemMenuProps {
  onAddTextNote: () => void;
  onAddImage: (file: File) => void;
  onAddVideo: (file: File) => void;
  onAddFile: (file: File) => void;
  colorOptions: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const AddItemMenu: React.FC<AddItemMenuProps> = ({
  onAddTextNote,
  onAddImage,
  onAddVideo,
  onAddFile,
  colorOptions,
  selectedColor,
  onColorChange,
}) => {
  return (
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
              onClick={onAddTextNote}
            >
              <StickyNote className="h-4 w-4 mr-2" /> Text Note
            </Button>
            
            <FileUploadButton
              onFileSelect={onAddImage}
              accept="image/*"
              tooltip="Upload image"
              variant="outline"
              size="default"
            >
              <Image className="h-4 w-4 mr-2" /> Image
            </FileUploadButton>
            
            <FileUploadButton
              onFileSelect={onAddVideo}
              accept="video/*"
              tooltip="Upload video"
              variant="outline"
              size="default"
            >
              <Video className="h-4 w-4 mr-2" /> Video
            </FileUploadButton>
            
            <FileUploadButton
              onFileSelect={onAddFile}
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
            <ColorSelector
              colorOptions={colorOptions}
              selectedColor={selectedColor}
              onColorChange={onColorChange}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddItemMenu;
