import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

export default function TableCellAvatar({
    image,
    alt,
    className,
    imageClassName,
    altTextClassName,
}: {
    image: string;
    alt: string;
    className?: string;
    imageClassName?: string;
    altTextClassName?: string;
}) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className={cn('size-12 overflow-hidden rounded-full border', className)}>
                <AvatarImage className={cn('object-contain',imageClassName)} src={image} alt={alt} />
                <AvatarFallback className={cn('bg-neutral-200 rounded font-normal text-black dark:bg-neutral-700 dark:text-white', altTextClassName)}>
                    {getInitials(alt)}
                </AvatarFallback>
            </Avatar>
        </>
    );
}
