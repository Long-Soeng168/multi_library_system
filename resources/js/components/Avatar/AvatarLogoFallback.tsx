import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import ThreeDotsFade from '../animated-icons/ThreeDotsFade';

interface AvatarLogoFallbackProps {
    image?: string;
    alt: string;
    className?: string;
    imageClassName?: string;
    fallbackClassName?: string;
    fallbackNode?: ReactNode; // custom fallback content
}

export default function AvatarLogoFallback({ image, alt, className, imageClassName, fallbackClassName, fallbackNode }: AvatarLogoFallbackProps) {
    const { website_info } = usePage<any>().props;
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    // handle missing image
    useEffect(() => {
        if (!image) setStatus('error');
    }, [image]);

    return (
        <Avatar className={cn('relative size-12 overflow-hidden rounded-full', className)}>
            {/* main image */}
            {image && status !== 'error' && (
                <img
                    src={image}
                    alt={alt}
                    className={cn(
                        'h-full w-full object-contain transition-opacity duration-300',
                        status === 'loaded' ? 'opacity-100' : 'opacity-0',
                        imageClassName,
                    )}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                />
            )}

            {/* loading overlay */}
            {image && status === 'loading' && (
                <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-muted/40">
                    {/* <span className="text-xs text-muted-foreground">Loading...</span> */}
                    <ThreeDotsFade className="w-10" />
                </div>
            )}

            {/* fallback (either custom node or default image) */}
            {status === 'error' && (
                <AvatarFallback className={cn('flex items-center justify-center overflow-hidden bg-muted', fallbackClassName)}>
                    {fallbackNode ? (
                        fallbackNode
                    ) : (
                        <img
                            className="size-2/3 object-contain"
                            src={`/assets/images/website_infos/thumb/${website_info?.logo}`}
                            alt="Fallback"
                        />
                    )}
                </AvatarFallback>
            )}
        </Avatar>
    );
}
