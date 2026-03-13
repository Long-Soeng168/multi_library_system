import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableCellActionsProps {
    children: React.ReactNode;
    tableCellClassName?: string;
}

const TableCellActions = ({ children, tableCellClassName }: TableCellActionsProps) => {
    return <TableCell className={cn('space-x-2 whitespace-nowrap', tableCellClassName)}>{children}</TableCell>;
};

export default TableCellActions;
