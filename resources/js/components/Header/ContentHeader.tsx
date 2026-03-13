import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';

interface ContentHeaderProps {
    title: string;
    description?: string;
    link?: string;
    containerClassName?: string;
}

export function ContentHeader({ title, description, link, containerClassName }: ContentHeaderProps) {
    return (
        <div className={cn(`mb-4`, containerClassName)}>
            {link ? (
                <Link href={link} prefetch className="group relative inline-flex items-center gap-2">
                    {/* Title + animated underline wrapper */}
                    <div className="flex flex-col">
                        <p className="text-xl font-bold tracking-tight md:text-3xl">{title}</p>

                        {/* Animate underline left → right */}
                        <div className="h-[3px] w-full origin-left scale-x-0 bg-true-primary transition-transform duration-300 group-hover:scale-x-100"></div>
                    </div>

                    <div
                        className={cn(
                            'top-3 right-3 flex translate-x-0 items-center justify-center rounded-full bg-muted p-1 text-primary transition-all duration-300 ease-out group-hover:translate-x-2 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground hover:scale-105',
                        )}
                    >
                        <ChevronRightIcon className="size-4" />
                    </div>
                </Link>
            ) : (
                <h2 className="text-xl font-bold tracking-tight md:text-3xl">{title}</h2>
            )}
            {description && <p className="text-gray-500 md:mt-2">{description}</p>}
        </div>
    );
}
