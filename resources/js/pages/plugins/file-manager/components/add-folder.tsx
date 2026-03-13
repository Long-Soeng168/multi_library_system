import { FormField } from '@/components/Input/FormField';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useFileManager } from '../hooks/FileManagerContext';

export function AddFolder({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { t } = useTranslation();
    const { getFolderData, currentFolder } = useFileManager();

    const { data, setData, post, progress, processing, errors, reset, transform } = inertiaUseForm({
        name: '',
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        transform(() => ({
            ...data,
            parent_id: currentFolder?.id || null,
        }));

        post('/api/file_manager/folders', {
            preserveScroll: true,
            onSuccess: (page) => {
                reset();
                getFolderData();
                if (page.props.flash?.success) {
                    toast.success('Success', { description: page.props.flash.success });
                }
                if (page.props.flash?.warning) {
                    toast.warning('Warning', { description: page.props.flash.warning });
                }
            },
            onError: () => {
                toast.error('Error: Upload Failed', { description: 'Something went wrong.' });
            },
            onFinish: () => {
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Create Folder')}</DialogTitle>
                    <DialogDescription className="flex">
                        <span className="mr-1 font-semibold whitespace-nowrap">Path : </span>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink className="cursor-pointer">Folders</BreadcrumbLink>
                                </BreadcrumbItem>
                                {currentFolder?.path?.length > 0 && <BreadcrumbSeparator />}
                                {currentFolder?.path?.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink className="cursor-pointer">{item.name}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {index !== currentFolder?.path.length - 1 && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                ))}
                                {currentFolder && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </DialogDescription>
                </DialogHeader>

                <>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <FormField
                            id="name"
                            name="name"
                            label="Folder Name"
                            value={data.name || ''}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                        />

                        {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                        <Button disabled={processing} type="button" onClick={(e) => onSubmit(e)}>
                            {processing && (
                                <span className="size-6 animate-spin">
                                    <Loader />
                                </span>
                            )}
                            {processing ? t('Submitting') : t('Submit')}
                        </Button>
                    </form>
                </>
            </DialogContent>
        </Dialog>
    );
}
