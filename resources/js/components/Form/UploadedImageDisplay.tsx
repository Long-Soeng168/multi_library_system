import usePermission from '@/hooks/use-permission';
import { cn } from '@/lib/utils';
import DeleteItemButton from '../Button/DeleteItemButton';
import { FormLabel } from '../Input/FormLabel';

type ImageInput = string | { image: string; id: number };

interface UploadedImageProps {
    label?: string;
    permission?: string;
    containerClassName?: string;
    imageContainerClassName?: string;
    imageClassName?: string;
    images?: ImageInput | ImageInput[];
    basePath?: string; // default: "/assets/images/thumb/"
    deletePath?: string;
}

export default function UploadedImage({
    containerClassName,
    imageContainerClassName,
    imageClassName,
    label = 'Uploaded Image',
    permission = '',
    images,
    basePath = '/assets/images/thumb/',
    deletePath = '',
}: UploadedImageProps) {
    if (!images) return null;

    // Normalize into array of strings
    const normalizedImages = Array.isArray(images)
        ? images.map((img) => (typeof img === 'string' ? { image: img, id: null } : { image: img.image, id: img.id }))
        : [{ image: typeof images === 'string' ? images : images.image, id: typeof images === 'string' ? null : images.id }];

    const hasPermission = usePermission();

    return (
        <div className={cn('mt-6 flex flex-col justify-start gap-2', containerClassName)}>
            <FormLabel label={label} />
            <div className={cn('flex h-auto flex-1 flex-wrap gap-2', imageContainerClassName)}>
                {normalizedImages.map((img, idx) => (
                    <span key={img.id ?? idx} className="group relative">
                        <img
                            src={basePath + img.image}
                            alt={img.image}
                            className={cn(
                                'group relative h-[126px] overflow-hidden rounded-md border bg-background dark:bg-white/10 object-contain p-0',
                                imageClassName,
                            )}
                        />
                        {img.id && deletePath && hasPermission(permission) && (
                            <span className="absolute top-1 right-1">
                                <DeleteItemButton deletePath={deletePath} permission={permission} id={img.id} />
                            </span>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}

// How to use it when call
// Single string
{
    /* <UploadedImage images="avatar.png" /> */
}

// Array of strings
{
    /* <UploadedImage images={["a.png", "b.png"]} /> */
}

// Array of objects
{
    /* <UploadedImage images={[{ image: "a.png", id: 1 }, { image: "b.png", id: 2 }]} /> */
}
