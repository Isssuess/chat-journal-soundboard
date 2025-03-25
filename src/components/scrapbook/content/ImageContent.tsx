
import React from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageContentProps {
  content: string;
  onChangeFile: () => void;
}

const ImageContent: React.FC<ImageContentProps> = ({ content, onChangeFile }) => {
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
          onClick={onChangeFile}
        >
          <Image className="h-4 w-4 mr-1" /> Change
        </Button>
      )}
    </div>
  );
};

export default ImageContent;
