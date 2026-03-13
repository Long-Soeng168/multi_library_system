import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { BookOpenTextIcon, ChevronDown, HomeIcon, InfoIcon, NewspaperIcon } from 'lucide-react';
import { useState } from 'react';

export const NavMenu = ({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) => {
    const { t } = useTranslation();
    const { url } = usePage();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const menuItems = [
        { href: '/', icon: <HomeIcon size={18} />, label: t('Home') },
        { href: '/resources', icon: <BookOpenTextIcon size={18} />, label: t('Resources') },
        { href: '/posts', icon: <NewspaperIcon size={18} />, label: t('Posts') },
        {
            href: '/about', // Changed from # so the link actually goes somewhere
            icon: <InfoIcon size={18} />,
            label: t('About'),
            dropdown: [
                { href: '/about', label: t('About Us') },
                { href: '/our-journey', label: t('Our Journey') },
                { href: '/our-staffs', label: t('Our Staffs') },
            ],
        },
    ];

    const isActive = (item: any) => {
        if (url === item.href || url.startsWith(item.href + '/')) return true;
        return item.dropdown?.some((sub: any) => url === sub.href || url.startsWith(sub.href + '/'));
    };

    const toggleDropdown = (label: string) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <nav className={cn('flex items-center', orientation === 'vertical' ? 'w-full flex-col items-start gap-1' : 'gap-1')}>
            {menuItems.map((item) => {
                const active = isActive(item);
                const isDropdownOpen = openDropdown === item.label;

                return (
                    <div
                        key={item.label}
                        className={cn('relative', orientation === 'vertical' ? 'w-full' : '')}
                        onMouseEnter={() => orientation === 'horizontal' && setOpenDropdown(item.label)}
                        onMouseLeave={() => orientation === 'horizontal' && setOpenDropdown(null)}
                    >
                        <div className="group flex items-center gap-0.5">
                            {/* Main Link Section */}
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200',
                                    orientation === 'vertical' ? 'flex-1 justify-start' : 'justify-center',
                                    // If there's a dropdown, round only the left side for a "joined" button look
                                    item.dropdown ? 'rounded-l-full' : 'rounded-full',
                                    active ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>

                            {/* Dropdown Toggle Button */}
                            {item.dropdown && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleDropdown(item.label);
                                    }}
                                    className={cn(
                                        'flex h-9 items-center justify-center rounded-r-full bg-muted pr-5 pl-4 transition-all duration-200',
                                        active ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                        isDropdownOpen && orientation === 'vertical' ? 'bg-secondary text-foreground' : '',
                                    )}
                                >
                                    <ChevronDown
                                        size={16}
                                        className={cn('opacity-60 transition-transform duration-300', isDropdownOpen && 'rotate-180 opacity-100')}
                                    />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Content */}
                        {item.dropdown && (
                            <div
                                className={cn(
                                    'overflow-hidden transition-all duration-300 ease-in-out',
                                    orientation === 'horizontal'
                                        ? 'absolute top-full left-0 z-50 w-52 pt-2'
                                        : 'relative mt-1 ml-6 border-l-2 border-primary/20',
                                    orientation === 'horizontal' &&
                                        (isDropdownOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'),
                                    orientation === 'vertical' && (isDropdownOpen || active ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'),
                                )}
                            >
                                <ul
                                    className={cn(
                                        'flex flex-col gap-1 p-1.5',
                                        orientation === 'horizontal' && 'rounded-2xl border bg-background/95 shadow-xl backdrop-blur-md',
                                    )}
                                >
                                    {item.dropdown.map((sub) => (
                                        <li key={sub.label}>
                                            <Link
                                                href={sub.href}
                                                className={cn(
                                                    'block rounded-sm px-4 py-2.5 text-sm transition-all duration-200',
                                                    url === sub.href
                                                        ? 'bg-primary font-semibold text-primary-foreground shadow-sm'
                                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                                )}
                                            >
                                                {sub.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};
