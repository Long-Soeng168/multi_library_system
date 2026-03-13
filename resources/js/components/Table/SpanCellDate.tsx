import { TableCell } from '@/components/ui/table';

interface SpanCellDateProps {
    value?: string | null;
    fallback?: string;
    className?: string;
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
}

const SpanCellDate = ({
    value,
    fallback = '---',
    className = '',
    locale = 'en-UK',
    options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
}: SpanCellDateProps) => {
    return <span className={className}>{value ? new Date(value).toLocaleDateString(locale, options) : fallback}</span>;
};

export default SpanCellDate;
