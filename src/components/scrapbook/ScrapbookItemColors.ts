
export const colorVariants = {
  yellow: 'bg-[#FEF7CD] border-[#F5D76E]',
  orange: 'bg-[#FEC6A1] border-[#E67E22]',
  blue: 'bg-[#D3E4FD] border-[#3498DB]',
  green: 'bg-[#F2FCE2] border-[#2ECC71]',
  pink: 'bg-[#FFDEE2] border-[#E91E63]',
  purple: 'bg-[#E5DEFF] border-[#9B59B6]',
  cyan: 'bg-[#D1F1F9] border-[#1ABC9C]',
};

export const getColorClass = (color: string) => {
  return colorVariants[color as keyof typeof colorVariants] || colorVariants.yellow;
};
