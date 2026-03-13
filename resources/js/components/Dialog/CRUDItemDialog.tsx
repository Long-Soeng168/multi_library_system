import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { ImageIcon, LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { TooltipButton } from '../Button/TooltipButton';

interface CRUDItemDialogProps {
    children?: React.ReactNode;
    permission?: string;
    tooltip?: string;
    dialogTitle?: string;
    buttonIcon?: LucideIcon;
    buttonTitle?: string;
    buttonSize?: 'icon' | 'default' | 'sm' | 'lg' | null | undefined;
    buttonVariant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null | undefined;
    buttonClassName?: string;
}

const CRUDItemDialog = ({
    children,
    permission,
    tooltip,
    dialogTitle,
    buttonIcon: Icon = ImageIcon,
    buttonTitle,
    buttonSize = 'icon',
    buttonVariant = 'outline',
    buttonClassName,
}: CRUDItemDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const hasPermission = usePermission();

    if (permission && !hasPermission(permission)) {
        return null;
    }

    return (
        <Dialog modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <TooltipButton tooltip={tooltip ? t(tooltip) : t('Tooltip')}>
                <DialogTrigger asChild>
                    <Button size={buttonSize} variant={buttonVariant} className={cn("h-9",buttonClassName)}>
                        <Icon /> {buttonTitle && t(buttonTitle)}
                    </Button>
                </DialogTrigger>
            </TooltipButton>
            {isOpen && <div className="fixed inset-0 z-40 bg-black/80" />} {/* Custom dark overlay */}
            <DialogContent className="z-50 max-h-[90dvh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle className="text-start">{dialogTitle ? t(dialogTitle) : t('Dialog')}</DialogTitle>
                    <DialogDescription className="hidden" />
                    {children}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default CRUDItemDialog;
