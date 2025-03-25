
import React from 'react';

export interface ColorOption {
  value: string;
  label: string;
  class: string;
}

interface ColorSelectorProps {
  colorOptions: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colorOptions,
  selectedColor,
  onColorChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          className={`w-6 h-6 rounded-full ${color.class} ${
            selectedColor === color.value 
              ? 'ring-2 ring-offset-2 ring-primary' 
              : 'hover:ring-2 hover:ring-offset-1 hover:ring-gray-300'
          }`}
          onClick={() => onColorChange(color.value)}
          title={color.label}
        />
      ))}
    </div>
  );
};

export default ColorSelector;
