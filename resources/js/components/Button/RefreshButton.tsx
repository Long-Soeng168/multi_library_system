import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { RotateCwIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { TooltipButton } from './TooltipButton';

const RefreshButton = ({ className }: { className?: string }) => {
    const { url } = usePage();
    const { t } = useTranslation();

    const handleRefresh = () => {
        // remove query string from current url
        const cleanUrl = url.split('?')[0];
        // router.get(cleanUrl, {}, { replace: true, preserveScroll: false, preserveState: false });
        window.location.href = window.location.pathname;
    };

    return (
        <TooltipButton tooltip={t('Refresh and Clear Filter')}>
            <Button
                onClick={handleRefresh}
                variant="ghost"
                size="icon"
                className={cn('size-11 rounded-md bg-muted text-foreground hover:bg-primary hover:text-white', className)}
            >
                <RotateCwIcon className={`h-5 w-5 transition`} />
            </Button>
        </TooltipButton>
    );
};

export default RefreshButton;
