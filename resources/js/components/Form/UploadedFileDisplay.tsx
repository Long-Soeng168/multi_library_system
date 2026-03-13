import usePermission from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react'; // icon for files
import DeleteItemButton from '../Button/DeleteItemButton';
import { FormLabel } from '../Input/FormLabel';

type FileInput = string | { file_name: string; id: number };

interface UploadedFileProps {
    label?: string;
    permission?: string;
    containerClassName?: string;
    fileContainerClassName?: string;
    fileClassName?: string;
    files?: FileInput | FileInput[];
    basePath?: string; // default: "/assets/files/posts/"
    deletePath?: string;
}

export default function UploadedFile({
    containerClassName,
    fileContainerClassName,
    fileClassName,
    label = 'Uploaded Files',
    permission = '',
    files,
    basePath = '/assets/files/posts/',
    deletePath = '',
}: UploadedFileProps) {
    if (!files) return null;

    // Normalize input
    const normalizedFiles = Array.isArray(files)
        ? files.map((f) => (typeof f === 'string' ? { file_name: f, id: null } : f))
        : [{ file_name: typeof files === 'string' ? files : files.file_name, id: typeof files === 'string' ? null : files.id }];

    const hasPermission = usePermission();

    return (
        <div className={cn('mt-6 flex flex-col justify-start gap-2', containerClassName)}>
            <FormLabel label={label} />
            <div className={cn('flex flex-col gap-2', fileContainerClassName)}>
                {normalizedFiles.map((file, idx) => (
                    <div className='flex gap-1'>
                        <a
                            href={`${basePath}${file.file_name}`}
                            target="_blank"
                            key={file.id ?? idx}
                            className={cn(
                                'group flex flex-1 items-center justify-between rounded-md border border-border bg-muted/30 px-3 h-9 text-sm hover:border-foreground dark:border-white/20 dark:bg-muted',
                                fileClassName,
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span rel="noopener noreferrer" className="truncate hover:underline">
                                    {file.file_name}
                                </span>
                            </div>
                        </a>
                        {file.id && deletePath && hasPermission(permission) && (
                            <DeleteItemButton deletePath={deletePath} permission="page update" id={file.id} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
