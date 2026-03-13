import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import FormFileUpload from '@/components/Form/FormFileUpload';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { useForm as inertiaUseForm } from '@inertiajs/react';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useFileManager } from '../hooks/FileManagerContext';

export function AddFiles({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { t } = useTranslation();
    const [files, setFiles] = useState<File[] | null>(null);

    const dropZoneConfig = {
        maxFiles: 100,
        maxSize: 1024 * 1024 * 10,
        multiple: true,
        accept: {}
    };

    const { data, setData, post, progress, processing, errors, reset, transform } = inertiaUseForm({
        files: null,
    });

    const { currentFolder, getFileData } = useFileManager();

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        transform(() => ({
            files: files || null,
            folder_id: currentFolder?.id || null,
        }));

        post('/api/file_manager/files', {
            preserveScroll: true,
            onSuccess: (page) => {
                reset();
                setFiles(null);
                getFileData();

                if (page.props.flash?.success) {
                    toast.success('Success', { description: page.props.flash.success });
                }

                const warningMessages = page?.props?.flash?.warning;
                if (warningMessages) {
                    toast.warning('Warning: File(s) Already Exist', {
                        description: (
                            <pre>
                                {Object.values(warningMessages).map((warn: any, index) => (
                                    <div className="flex" key={index}>
                                        <span className="text-muted-foreground">{index + 1}. </span>
                                        <div className="w-full flex-1 whitespace-normal text-yellow-500">{warn}</div>
                                    </div>
                                ))}
                            </pre>
                        ),
                    });
                }
            },
            // onError: (e) => {
            //     toast.error('Error: Upload Failed', {
            //         description: 'Something went wrong.' + JSON.stringify(e, null, 2),
            //     });
            // },
            // onFinish: () => {
            //     setFiles(null);
            //     setOpen(false);
            // },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('Upload Files')}</DialogTitle>
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
                    <form onSubmit={onSubmit} className="mt-2 space-y-6">
                        {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}

                        <FormFileUpload dropzoneOptions={dropZoneConfig} id="files" label="Files" files={files} setFiles={setFiles} />

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
