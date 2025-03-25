
import React from 'react';
import ScrapbookItem, { ScrapbookItemProps } from '../ScrapbookItem';

interface ScrapbookItemsListProps {
  items: Omit<ScrapbookItemProps, 'onUpdate' | 'onDelete' | 'onZIndexChange'>[];
  onUpdateItem: (id: string, data: Partial<Omit<ScrapbookItemProps, 'id' | 'onUpdate' | 'onDelete' | 'onZIndexChange'>>) => void;
  onDeleteItem: (id: string) => void;
  onChangeItemZIndex: (id: string, zIndex: number) => void;
}

const ScrapbookItemsList: React.FC<ScrapbookItemsListProps> = ({ 
  items, 
  onUpdateItem, 
  onDeleteItem, 
  onChangeItemZIndex 
}) => {
  return (
    <>
      {items.map((item) => (
        <ScrapbookItem
          key={item.id}
          {...item}
          onUpdate={onUpdateItem}
          onDelete={onDeleteItem}
          onZIndexChange={onChangeItemZIndex}
        />
      ))}
    </>
  );
};

export default ScrapbookItemsList;
