import { TooltipButton } from '@/components/Button/TooltipButton';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { InfoIcon, MousePointerClickIcon } from 'lucide-react';

export default function HelpDialog() {
    const { t } = useTranslation();
    return (
        <Dialog>
            <TooltipButton tooltip={t('Help')}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn('size-11 rounded-md bg-muted text-foreground hover:bg-primary hover:text-white')}
                    >
                        <InfoIcon className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
            </TooltipButton>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('Help')}</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div>
                        <Alert className="rounded-none border-0 border-l-4 border-l-blue-500 bg-blue-500/10 dark:bg-blue-500/20">
                            <MousePointerClickIcon className="h-4 w-4 text-blue-500!" />
                            <AlertTitle>
                                <b>Double-click</b> a record to view its subcategory.
                            </AlertTitle>
                        </Alert>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
