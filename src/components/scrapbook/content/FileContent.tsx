
import React from 'react';
import { FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileContentProps {
  content: string;
  onChangeFile: () => void;
}

const FileContent: React.FC<FileContentProps> = ({ content, onChangeFile }) => {
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
        onClick={onChangeFile}
      >
        Change File
      </Button>
    </div>
  );
};

export default FileContent;
