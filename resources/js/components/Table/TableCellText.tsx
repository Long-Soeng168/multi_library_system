import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface TableCellTextProps {
    value?: string | number | null;
    fallback?: string;
    className?: string;
    isLink?: boolean;
}

const TableCellText = ({ value, fallback = '---', className, isLink = false }: TableCellTextProps) => {
    return (
        <TableCell>
            {isLink ? (
                <a
                    href={value?.toString() || '#'}
                    className={cn('line-clamp-5 max-w-[250px] text-ellipsis hover:text-primary hover:underline', className)}
                    dangerouslySetInnerHTML={{ __html: value !== null && value !== undefined && value !== '' ? value : fallback }}
                />
            ) : (
                <p
                    className={cn('line-clamp-5 max-w-[250px] text-ellipsis', className)}
                    dangerouslySetInnerHTML={{ __html: value !== null && value !== undefined && value !== '' ? value : fallback }}
                />
            )}
        </TableCell>
    );
};

export default TableCellText;
