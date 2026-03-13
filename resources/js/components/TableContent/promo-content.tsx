/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface PromoContentProps {
    className?: string;
}

export function PromoContent({ className }: PromoContentProps) {
    return (
        <div className={cn('border-t border-border bg-muted/20 p-3', className)}>
            <div className="flex items-center gap-3">
                <img src="/icon512_maskable.png" alt="" className="h-8 w-8 flex-shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground/90">Royal University of Law and Economic</p>
                    <p className="truncate text-xs text-muted-foreground">Library</p>
                </div>
                <Link href="/" className="text-xs font-medium text-primary hover:text-primary/80">
                    Home Page
                </Link>
            </div>
        </div>
    );
}
