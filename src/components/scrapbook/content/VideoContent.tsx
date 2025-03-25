
import React from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoContentProps {
  content: string;
  onChangeFile: () => void;
}

const VideoContent: React.FC<VideoContentProps> = ({ content, onChangeFile }) => {
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
          onClick={onChangeFile}
        >
          <Image className="h-4 w-4 mr-1" /> Change
        </Button>
      )}
    </div>
  );
};

export default VideoContent;
