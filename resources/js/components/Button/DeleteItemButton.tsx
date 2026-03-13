import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { useForm } from '@inertiajs/react';
import { LoaderCircleIcon, Trash2Icon, TriangleAlertIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TooltipButton } from './TooltipButton';

const DeleteItemButton = ({ deletePath = '#', id, permission }: { deletePath?: string; id?: number; permission?: string }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const hasPermission = usePermission();

    if (permission && !hasPermission(permission)) {
        return null;
    }

    const handleDelete = () => {
        destroy(deletePath + id, {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    toast.success('Success', {
                        description: page.props.flash.success,
                    });
                }
                if (page.props.flash?.error) {
                    toast.error('Error', {
                        description: page.props.flash.error,
                    });
                }
                setIsOpen(false);
            },
            onError: (e) => {
                toast.error('Error', {
                    description: 'Failed to create.' + JSON.stringify(e, null, 2),
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <TooltipButton tooltip={t('Delete Item')}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-destructive shadow-none hover:text-destructive">
                        <Trash2Icon />
                    </Button>
                </DialogTrigger>
            </TooltipButton>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-2 text-start text-destructive">
                            <TriangleAlertIcon />
                            {t('Delete Item')} (ID: {id})
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-start">{t('Are you sure you want to delete this item?')}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col">
                    <Button
                        onClick={handleDelete}
                        autoFocus
                        className="ring-destructive/20 focus:ring-4 dark:bg-destructive dark:ring-destructive/40"
                        disabled={processing}
                        variant="destructive"
                    >
                        {processing && (
                            <span className="animate-spin">
                                <LoaderCircleIcon />
                            </span>
                        )}
                        {processing ? t('Deleting') : t('Delete')}
                    </Button>
                    <Button onClick={() => setIsOpen(false)} disabled={processing} variant="outline" className="border border-foreground">
                        {t('Cancel')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteItemButton;
