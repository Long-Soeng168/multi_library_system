import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { BookOpenTextIcon, HomeIcon, InfoIcon, NewspaperIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function BottomNavbarHideAndShow() {
    const [show, setShow] = useState(true);
    const lastScrollY = useRef(0);
    const { t } = useTranslation();
    const { url } = usePage(); // get current URL from Inertia

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 0) {
                setShow(true);
            } else if (currentScrollY > lastScrollY.current) {
                setShow(false);
            } else {
                setShow(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', controlNavbar, { passive: true });
        return () => window.removeEventListener('scroll', controlNavbar);
    }, []);

    const navItems = [
        { label: t('Home'), url: '/', icon: <HomeIcon size={24} /> },
        { label: t('Resources'), url: '/resources', icon: <BookOpenTextIcon size={24} /> },
        { label: t('Posts'), url: '/posts', icon: <NewspaperIcon size={24} /> },
        { label: t('About'), url: '/about', icon: <InfoIcon size={24} /> },
    ];

    return (
        <nav
            className={`fixed bottom-0 left-0 z-40 w-full border-t border-border bg-background transition-transform duration-300 ease-in-out ${
                show ? 'translate-y-0' : 'translate-y-full'
            } lg:hidden`}
        >
            <div className="flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = url === item.url || url.startsWith(item.url + '/');

                    return (
                        <Link
                            key={item.label}
                            href={item.url}
                            prefetch
                            className={`flex flex-1 justify-center pt-2 pb-4 ${isActive ? 'bg-muted' : ''} `}
                        >
                            <button
                                className={`mt-1 flex flex-col items-center transition-colors ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-primary'} `}
                            >
                                {item.icon}
                                <span className="mt-1 text-[12px] leading-none">{item.label}</span>
                            </button>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
