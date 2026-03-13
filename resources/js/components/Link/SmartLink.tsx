import { Link } from '@inertiajs/react';

interface SmartLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    prefetch?: boolean;
}

export default function SmartLink({ href, children, className, prefetch = true }: SmartLinkProps) {
    const isExternal = href.startsWith('http://') || href.startsWith('https://');

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} prefetch={prefetch} className={className}>
            {children}
        </Link>
    );
}
