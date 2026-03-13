import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useTranslation from '@/hooks/use-translation';
import React from 'react';
import { Button } from '../ui/button';

export function TooltipButton({
    side = 'bottom',
    tooltip = '',
    children,
}: {
    side?: 'top' | 'right' | 'bottom' | 'left';
    children: React.ReactElement<typeof Button>;
    tooltip?: string | null;
}) {
    const { t } = useTranslation();
    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{tooltip ? t(tooltip) : t('Tooltip')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
