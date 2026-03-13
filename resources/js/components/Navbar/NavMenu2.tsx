import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { BookOpenTextIcon, ChevronDown, HomeIcon, InfoIcon, NewspaperIcon } from 'lucide-react';

export const NavMenu2 = ({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) => {
    const { t } = useTranslation();
    const { url } = usePage();

    const isActive = (href: string) => {
        // for exact match, you can do: return url === href
        // for prefix match (like /about/*), use startsWith
        return url === href || url.startsWith(href + '/');
    };

    const menuItems = [
        { href: '/', icon: <HomeIcon size={16} />, label: t('Home') },
        { href: '/resources', icon: <BookOpenTextIcon size={16} />, label: t('Resources') },
        { href: '/posts', icon: <NewspaperIcon size={16} />, label: t('Posts') },
        {
            href: '/about',
            icon: <InfoIcon size={16} />,
            label: t('About'),
            dropdown: [
                { href: '/about', label: t('About') },
                { href: '/our-journey', label: t('Our Journey') },
                { href: '/our-staffs', label: t('Our Staffs') },
            ],
        },
    ];

    return (
        <ul className={`flex flex-1 justify-start gap-2 ${orientation === 'vertical' ? 'w-full flex-col items-start gap-3' : ''}`}>
            {menuItems.map((item, idx) => (
                <li key={idx} className={`group ${orientation === 'vertical' ? 'w-full' : 'w-auto'} relative`}>
                    <Link
                        prefetch
                        href={item.href}
                        className={`relative flex w-full items-center gap-1 rounded-none px-3 py-2 text-sm font-medium transition-colors ${isActive(item.href) ? 'text-primary' : 'text-foreground'} hover:bg-muted dark:hover:bg-none`}
                    >
                        {item.icon}
                        {item.label}
                        {item.dropdown && <ChevronDown className="ml-2 text-muted-foreground" size={16} />}
                    </Link>

                    <div
                        className={`h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 ${isActive(item.href) ? 'scale-x-100' : ''}`}
                    ></div>

                    {item.dropdown && (
                        <ul className="absolute top-full left-0 z-20 mt-0 hidden w-full flex-col border bg-background shadow-lg group-hover:flex dark:border-white/30">
                            {item.dropdown.map((sub, sidx) => (
                                <li key={sidx}>
                                    <Link
                                        prefetch
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm transition-colors ${isActive(sub.href) ? 'text-true-primary' : 'text-foreground'} hover:bg-muted dark:hover:bg-none`}
                                    >
                                        {sub.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};
