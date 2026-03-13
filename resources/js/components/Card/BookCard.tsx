import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface BlogCardProps {
    url: string;
    title: string;
    description: string;
    date: string;
    thumbnail?: string;
    showRightBorder?: boolean;
}

export function BookCard({ url, title, description, date, thumbnail, showRightBorder = true }: BlogCardProps) {
    return (
        <Link
            href={url}
            className={cn(
                "group relative block before:absolute before:top-0 before:-left-0.5 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-0 after:h-px after:w-screen after:bg-border after:content-['']",
                showRightBorder && 'border-b-0 border-border md:border-r',
            )}
        >
            <div className="flex flex-col">
                {thumbnail && (
                    <div className="relative aspect-video w-full overflow-hidden">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="object-cover w-full transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2 p-6">
                    <h3 className="text-xl font-semibold text-card-foreground underline-offset-4 group-hover:underline">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                    <time className="block text-sm font-medium text-muted-foreground">{date}</time>
                </div>
            </div>
        </Link>
    );
}
