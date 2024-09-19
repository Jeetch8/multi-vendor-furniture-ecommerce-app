import { TableCell, TableRow } from '@/components/ui/table';
import { TCategoryForSidebar } from '@/types';
import { formatDateSecondary } from '@/utils/helpers';

type CategoryTableRowProps = {
  category: TCategoryForSidebar;
  index: number;
};

function CategoryTableRow({ category, index }: CategoryTableRowProps) {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{category.name}</TableCell>
      {/* TODO: Active column. */}
      <TableCell>{category.isActive ? 'yes' : 'no'} </TableCell>
      <TableCell>{formatDateSecondary(category.createdAt!)}</TableCell>
      <TableCell>{formatDateSecondary(category.updatedAt!)}</TableCell>
    </TableRow>
  );
}

export default CategoryTableRow;
