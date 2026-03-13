import DashboardChart from '@/components/Chart/DashboardChart';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ExternalLinkIcon, LockKeyholeIcon, LucideIcon, SettingsIcon, ShapesIcon, UserCog2Icon, UsersIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const mainNavItems: {
    title: string;
    description?: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    permission?: string;
    activeList?: string[];
    items?: {
        title: string;
        url: string;
        permission?: string;
    }[];
}[] = [
    {
        title: 'Users',
        description: 'Manage all users, roles, and permissions in the system.',
        url: '/admin/users',
        icon: UsersIcon,
        activeList: ['/admin/users', '/admin/roles', '/admin/permissions'],
        permission: 'user view',
    },
    {
        title: 'Website Settings',
        description: 'Update website information, logos, and general settings.',
        url: '/admin/website-infos',
        icon: SettingsIcon,
        permission: 'website_info view',
    },
    {
        title: 'Items',
        description: 'Manage items published in the Web.',
        url: '/admin/items',
        icon: ShapesIcon,
        permission: 'item view',
    },
    {
        title: 'Posts',
        description: 'Manage posts published in the Web.',
        url: '/admin/posts',
        icon: ShapesIcon,
        permission: 'post view',
    },
    {
        title: 'Links',
        description: 'Manage Social Media Links in the Web.',
        url: '/admin/links',
        icon: ExternalLinkIcon,
        permission: 'link view',
    },
    // {
    //     title: 'Types',
    //     description: 'Manage categories, types, and classification codes used in the system.',
    //     url: '/admin/types',
    //     icon: ShapesIcon,
    //     permission: 'type view',
    // },
];

export default function Dashboard() {
    const { t, currentLocale } = useTranslation();
    const hasPermission = usePermission();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {hasPermission('item view') && <DashboardChart />}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href={`/settings/profile`}
                        className={`group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 p-6 text-center transition hover:bg-muted dark:border-sidebar-border`}
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />

                        <UserCog2Icon className="mb-3 h-12 w-12 text-primary transition group-hover:scale-110" />

                        <h3 className="text-lg font-semibold">{t('Profile Settings')}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{t('Update your personal information and preferences')}</p>
                    </Link>
                    {/* <Link
                        href={`/settings/password`}
                        className={`group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 p-6 text-center transition hover:bg-muted dark:border-sidebar-border`}
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />

                        <LockKeyholeIcon className="mb-3 h-12 w-12 text-primary transition group-hover:scale-110" />

                        <h3 className="text-lg font-semibold">{t('Change Password')}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{t('Update your account password securely')}</p>
                    </Link> */}

                    {/* Admin Menu */}
                    {mainNavItems?.map((item) => {
                        // Skip if permission is defined but user doesn't have it
                        if (item.permission && !hasPermission(item.permission)) return null;

                        const Icon = item.icon; // get the Lucide icon component if exists

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 p-6 text-center transition hover:bg-muted dark:border-sidebar-border"
                            >
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />

                                {Icon ? (
                                    <Icon className="mb-3 h-12 w-12 text-primary transition group-hover:scale-110" />
                                ) : (
                                    <LockKeyholeIcon className="mb-3 h-12 w-12 text-primary transition group-hover:scale-110" />
                                )}

                                <h3 className="text-lg font-semibold">{t(item.title)}</h3>
                                {item.description && <p className="mt-1 text-sm text-muted-foreground">{t(item.description)}</p>}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Placeholder */}
            {/* <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div> */}
        </AppLayout>
    );
}
