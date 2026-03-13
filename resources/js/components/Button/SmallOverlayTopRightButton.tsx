import { cn } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';

const SmallOverlayTopRightButton = ({ className, iconSize = 4 }: { className?: string; iconSize?: number }) => {
    return (
        <div
            className={cn(
                'absolute top-3 right-3 flex translate-x-2 scale-75 text-primary-foreground hover:translate-x-1 hover:scale-105 items-center justify-center rounded-full bg-primary p-1 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100',
                className,
            )}
        >
            <ChevronRightIcon className={`size-${iconSize}`} />
        </div>
    );
};

export default SmallOverlayTopRightButton;
