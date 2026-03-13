import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { CheckIcon, EditIcon, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StatusOption {
    label: string;
    value: string | number;
}

interface Props {
    currentStatus: string | number;
    updatePath: string;
    status: StatusOption[];
    permission?: string;
    onSuccess?: () => void;
}

const UpdateFineStatusButton = ({ currentStatus, updatePath, status, permission, onSuccess }: Props) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        status: currentStatus,
    });

    const hasPermission = usePermission();

    if (permission && !hasPermission(permission)) {
        return null;
    }

    // Find the label for the trigger
    const activeOption = status.find((s) => s.value === currentStatus);

    const handleUpdate = () => {
        post(updatePath, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                toast.success(t(page.props.flash?.success || 'Success'));
                setIsOpen(false);
                if (onSuccess) onSuccess();
            },
            onError: (errors) => {
                toast.error(t('Error'), {
                    description: Object.values(errors).join(', '),
                });
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* Applied your specific badge styling here */}
                <button
                    type="button"
                    className={cn(
                        'inline-flex w-fit cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 hover:opacity-80 active:scale-95',
                        currentStatus == 1
                            ? [
                                  // Paid / Success Status
                                  'border-green-200 bg-green-50 text-green-700',
                                  'dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400',
                              ]
                            : [
                                  // Unpaid / Error Status
                                  'border-red-200 bg-red-50 text-red-700',
                                  'dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400',
                              ],
                    )}
                >
                    {t(activeOption?.label || '') || 'Unknown'}
                    <EditIcon className="size-3 opacity-80" />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-start">{t('Update Status')}</DialogTitle>
                    <DialogDescription className="text-start">{t('Select the new status below, then click confirm.')}</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-3 py-4">
                    {status.map((option, index) => {
                        const isSelected = data.status === option.value;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setData('status', option.value)}
                                className={cn(
                                    'flex items-center justify-between rounded-lg border-2 px-4 py-4 text-sm font-medium transition-all duration-200 outline-none',
                                    isSelected
                                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                                        : 'border-muted bg-transparent text-muted-foreground hover:border-muted-foreground/50',
                                )}
                            >
                                {t(option.label)}
                                <div
                                    className={cn(
                                        'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
                                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30',
                                    )}
                                >
                                    {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <Button onClick={handleUpdate} disabled={processing || data.status === currentStatus} className="w-full shadow-md">
                        {processing && <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />}
                        {t('Confirm Change')}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={processing}
                        className="w-full text-muted-foreground hover:text-foreground"
                    >
                        {t('Cancel')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateFineStatusButton;
