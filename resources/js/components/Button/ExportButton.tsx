import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { FileUpIcon } from 'lucide-react';

export default function ExportButton({ endpoint = '#', label = 'Export Excel', className = '' }) {
    const handleExport = () => {
        const params = new URLSearchParams(window.location.search);
        window.open(`${endpoint}?${params.toString()}`, '_blank');
    };

    const { t } = useTranslation();

    return (
        <Button variant="secondary" className={cn('h-11 border duration-300 hover:border-primary', className)} onClick={handleExport}>
            <FileUpIcon /> {t(label)}
        </Button>
    );
}
