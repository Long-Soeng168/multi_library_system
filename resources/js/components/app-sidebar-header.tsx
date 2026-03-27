import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import useTranslation from '@/hooks/use-translation';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRightLeft, HomeIcon } from 'lucide-react';
import AppLogo from './app-logo';
import LibraryStatusBadge from './Badge/LibraryStatusBadge';
import NavLanguage from './Navbar/NavLanguage';
import { SwitchDarkModeSmoothAnimated } from './Switch/SwitchDarkModeSmoothAnimated';
import { Button } from './ui/button';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { can_switch_language, user_library } = usePage<any>().props;
    const { t } = useTranslation();
    return (
        <header className="flex h-auto shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="my-4 flex w-full flex-wrap items-center justify-between gap-4">
                <div className="order-3 flex items-center gap-2 md:order-1 md:flex-1">
                    <SidebarTrigger className="-ml-1 rounded-[6px] border border-primary text-primary hover:text-primary hover:ring-3 hover:ring-primary/20" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="order-2 flex items-start justify-between gap-2 max-md:w-full">
                    <div className="mt-1 flex items-center md:hidden">
                        <AppLogo />
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {/* <LibraryStatusBadge /> */}
                        {user_library?.id && (
                            <Link href={'/admin/circulations-checkout'}>
                                <Button variant="secondary" className="h-9 overflow-hidden rounded-md border hover:border-primary">
                                    <ArrowRightLeft /> {t('Check Out/In')}
                                </Button>
                            </Link>
                        )}

                        <Link href={'/'} prefetch>
                            <Button variant="secondary" className="h-9 overflow-hidden rounded-md border hover:border-primary">
                                <HomeIcon /> {t('Home')}
                            </Button>
                        </Link>
                        <div className="mr-2">
                            <SwitchDarkModeSmoothAnimated />
                        </div>
                        {can_switch_language == true && <NavLanguage />}
                    </div>
                </div>
            </div>
        </header>
    );
}
