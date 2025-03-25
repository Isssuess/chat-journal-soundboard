
import React, { useRef } from 'react';
import { PaperclipIcon, FileImage, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  accept = '*',
  icon = <PaperclipIcon className="h-4 w-4" />,
  tooltip = 'Upload file',
  variant = 'ghost',
  size = 'icon',
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    onFileSelect(files[0]);
    
    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const getIconByAccept = () => {
    if (accept.includes('image')) return <FileImage className="h-4 w-4" />;
    if (accept.includes('video')) return <FileVideo className="h-4 w-4" />;
    return <PaperclipIcon className="h-4 w-4" />;
  };
  
  const buttonIcon = icon || getIconByAccept();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size={size} 
            className="rounded-full opacity-70 hover:opacity-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {buttonIcon}
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="sr-only"
        accept={accept}
        onChange={handleFileSelect}
      />
    </TooltipProvider>
  );
};

export default FileUploadButton;
