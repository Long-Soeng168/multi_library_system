import useTranslation from '@/hooks/use-translation';
import { CloudUpload } from 'lucide-react';
import * as React from 'react';
import { FormErrorLabel } from '../Input/FormErrorLabel';
import { FormLabel } from '../Input/FormLabel';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '../ui/file-upload'; // adjust path

interface FormFileUploadProps {
    id: string;
    label: string;
    error?: string;
    files: File[] | null;
    setFiles: (value: File[] | null) => void;
    dropzoneOptions?: {
        maxFiles?: number;
        maxSize?: number;
        multiple?: boolean;
        accept?: Record<string, string[]>;
    };
    className?: string;
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({ id, label, error, files, setFiles, dropzoneOptions, className = '' }) => {
    const defaultDropzone = {
        maxFiles: 1,
        maxSize: 1024 * 1024 * 4,
        multiple: false,
        accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'image/gif': ['.gif'], 'image/webp': ['.webp'], 'image/svg+xml': ['.svg'] },
    };

    const finalDropzoneOptions = { ...defaultDropzone, ...dropzoneOptions };
    const { t } = useTranslation();
    return (
        <div className="grid content-start gap-2">
            <FormLabel id={id} label={label} />
            <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={finalDropzoneOptions} className="relative group rounded-lg bg-background">
                <FileInput id={id} className="border dark:bg-muted border-foreground/50 group-hover:border-foreground border-dashed">
                    <div className="flex w-full flex-col items-center justify-center p-8">
                        <CloudUpload className="h-10 w-10 text-muted-foreground" />
                        <p className="text-center text-sm text-muted-foreground">
                            <span className="text-foreground">{t('Click to upload')}</span> {t('or drag and drop')}
                        </p>
                        {/* <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p> */}
                    </div>
                </FileInput>
                <FileUploaderContent>
                    {files?.map((file, i) => (
                        <FileUploaderItem key={i + file.name} index={i}>
                            <span>
                                {t('File')} : {file.name}
                            </span>
                        </FileUploaderItem>
                    ))}
                </FileUploaderContent>
                <FormErrorLabel className="mt-2" error={error} />
            </FileUploader>
        </div>
    );
};

export default FormFileUpload;
