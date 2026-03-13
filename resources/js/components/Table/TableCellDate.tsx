import { TableCell } from '@/components/ui/table';

interface TableCellDateProps {
    value?: string | null;
    fallback?: string;
    className?: string;

    locale?: string;
    timezone?: string;

    showTime?: boolean;
    fullYear?: boolean;
}

const TableCellDate = ({
    value,
    fallback = '---',
    className = '',
    locale = 'en-GB',
    timezone = 'Asia/Bangkok',
    showTime = true,
    fullYear = true,
}: TableCellDateProps) => {
    if (!value) return <TableCell className={className}>{fallback}</TableCell>;

    const date = new Date(value);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        day: '2-digit',
        month: 'short',
        year: fullYear ? 'numeric' : '2-digit',
    };

    if (showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
    }

    const formatted = date.toLocaleString(locale, options);

    return <TableCell className={className}>{formatted}</TableCell>;
};

export default TableCellDate;
