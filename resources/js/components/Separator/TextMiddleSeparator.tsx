import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

const TextMiddleSeparator = ({ title = 'Separator', className }: { title?: string; className?: string }) => {
    return (
        <>
            <div className={cn('relative my-4 flex items-center justify-center overflow-hidden', className)}>
                <Separator className="h-0 border-t border-dashed bg-transparent" />
                <div className="bg-background px-2 text-center shrink-0 text-sm">{title}</div>
                <Separator className="h-0 border-t border-dashed bg-transparent" />
            </div>
        </>
    );
};

export default TextMiddleSeparator;
