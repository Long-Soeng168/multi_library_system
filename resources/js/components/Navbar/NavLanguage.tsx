import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';

const NavLanguage = ({ buttonClassName = '' }) => {
    const { currentLocale } = useTranslation();

    const switchLang = (locale: string) => {
        router.visit(`/lang/${locale}`, {
            preserveState: false,
            preserveScroll: false,
            replace: true,
            onSuccess: () => {
                // If your useTranslation hook doesn't auto-refresh, force reload:
                window.location.reload();
            },
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="icon"
                variant="outline"
                onClick={() => switchLang('kh')}
                className={cn(
                    `object-coverfull h-9 overflow-hidden dark:border-white ${currentLocale === 'kh' && 'ring-3 ring-primary/40'}`,
                    buttonClassName,
                )}
            >
                <img className="h-full w-full object-cover" src="/assets/icons/flags/kh.png" alt="KH Flag" />
            </Button>

            <Button
                size="icon"
                variant="outline"
                onClick={() => switchLang('en')}
                className={cn(
                    `object-coverfull h-9 overflow-hidden dark:border-white ${currentLocale === 'en' && 'ring-3 ring-primary/40'}`,
                    buttonClassName,
                )}
            >
                <img className="h-full w-full object-cover" src="/assets/icons/flags/uk.png" alt="UK Flag" />
            </Button>
        </div>
    );
};

export default NavLanguage;
