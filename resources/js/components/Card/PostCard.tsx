import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Badge } from '../ui/badge';

interface BlogCardProps {
    url: string;
    title: string;
    description: string;
    date: string;
    categoryName: string;
    thumbnail?: string;
    showRightBorder?: boolean;
}

export function PostCard({ url, title, description, date, categoryName, thumbnail }: BlogCardProps) {
    return (
        <Link href={url} className={cn('group relative block h-full border')}>
            <div className="flex h-full flex-col">
                {thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden">
                        <img src={thumbnail} alt={title} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        {categoryName && <Badge className="absolute right-1 bottom-1 rounded-none bg-primary/80">{categoryName}</Badge>}
                    </div>
                )}

                <div className="flex h-full flex-1 flex-col justify-between gap-2 p-4">
                    <p className="line-clamp-2 text-xl font-semibold text-card-foreground underline-offset-4 group-hover:underline">{title}</p>
                    <div className="flex flex-1 flex-col justify-between">
                        <p className="line-clamp-4 text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
