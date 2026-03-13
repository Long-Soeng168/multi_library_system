import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import clsx from 'clsx';

interface TableCellBadgeProps {
    value?: string | number | null;
    fallback?: string;
    variant?: any;
    className?: string;
    isLink?: boolean;
    href?: string;
}

const TableCellBadge = ({ value, variant = 'default', fallback = '---', className, isLink = false, href }: TableCellBadgeProps) => {
    const displayValue = value?.toString() || fallback;
    const badge = (
        <Badge variant={variant} className={clsx('inline-block rounded', className)}>
            {displayValue}
        </Badge>
    );

    return (
        <TableCell className="p-0 align-middle">
            {isLink && value ? (
                <a href={href || value.toString()} className="transition hover:underline hover:opacity-80">
                    {badge}
                </a>
            ) : (
                badge
            )}
        </TableCell>
    );
};

export default TableCellBadge;
