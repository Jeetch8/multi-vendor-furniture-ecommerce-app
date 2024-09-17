'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleExportExcel } from '@/utils/helpers';
import { RiFileExcel2Line } from 'react-icons/ri';

function ExcelButton() {
  const handleClick = () => {
    handleExportExcel();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-2 rounded-xl bg-secondary px-4 py-2 text-primary active:bg-primary-foreground duration-200">
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-secondary">
        <DropdownMenuLabel>Export by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleClick}
          className="flex cursor-pointer gap-2"
        >
          <RiFileExcel2Line className="h-[15px] w-[15px]" /> Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExcelButton;
