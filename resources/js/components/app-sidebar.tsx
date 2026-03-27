import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeftRightIcon,
    BarChart3,
    BookOpen,
    CreditCardIcon,
    FilesIcon,
    Folder,
    LanguagesIcon,
    LayoutGrid,
    LayoutList,
    LucideIcon,
    MapPinHouseIcon,
    SettingsIcon,
    ShapesIcon,
    UsersIcon,
} from 'lucide-react';
import AppLogo from './app-logo';
import { Separator } from './ui/separator';

const mainNavItems: {
    title: string;
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
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    // {
    //     title: 'Your Library',
    //     url: '/manage-library-data',
    //     icon: SchoolIcon,
    // },
    {
        title: 'Users',
        url: '/admin/users',
        icon: UsersIcon,
        activeList: ['/admin/users', '/admin/roles', '/admin/permissions'],
        permission: 'user view',
        items: [
            {
                title: 'All Users',
                url: '/admin/users',
                permission: 'user view',
            },
            {
                title: 'Roles',
                url: '/admin/roles',
                permission: 'role view',
            },
            {
                title: 'Permissions',
                url: '/admin/permissions',
                permission: 'permission view',
            },
            {
                title: 'User Categories',
                url: '/admin/user-categories',
                permission: 'user_category view',
            },
        ],
    },
    {
        title: 'Circulations',
        url: '/admin/all-circulations',
        icon: ArrowLeftRightIcon,
        activeList: ['/admin/all-circulations', '/admin/circulations-checkout', '/admin/circulations-checkin', '/admin/circulation-rules'],
        permission: 'circulation view',
        items: [
            {
                title: 'All Circulations',
                url: '/admin/all-circulations',
                permission: 'circulation view',
            },
            // {
            //     title: 'Checkout',
            //     url: '/admin/circulations-checkout',
            //     permission: 'circulation view',
            // },
            // {
            //     title: 'Checkin',
            //     url: '/admin/circulations-checkin',
            //     permission: 'circulation view',
            // },
            {
                title: 'Circulation Rule',
                url: '/admin/circulation-rules',
                permission: 'circulation view',
            },
        ],
    },
    {
        title: 'Items',
        url: '/admin/items',
        icon: LayoutList,
        activeList: ['/admin/items', '/admin/item-categories'],
        permission: 'item view',
        items: [
            {
                title: 'All Items',
                url: '/admin/items',
                permission: 'item view',
            },
            {
                title: 'All Physical Copies',
                url: '/admin/items-physical-copies',
                permission: 'item view',
            },
            {
                title: 'Main Categories',
                url: '/admin/item-main-categories',
                permission: 'item_category view',
            },
            {
                title: 'Categories',
                url: '/admin/item-categories',
                permission: 'item_category view',
            },
            {
                title: 'Item Types',
                url: '/admin/item-types',
                permission: 'item_type view',
            },
            {
                title: 'Libraries',
                url: '/admin/libraries',
                permission: 'library view',
            },
        ],
    },
    {
        title: 'Items Engagements',
        url: '/admin/item-views',
        icon: BarChart3,
        activeList: ['/admin/item-views', '/admin/item-reads', '/admin/item-downloads'],
        permission: 'item view',
        items: [
            {
                title: 'Views',
                url: '/admin/item-views',
                permission: 'item view',
            },
            {
                title: 'Top Views',
                url: '/admin/top-item-views',
                permission: 'item view',
            },
            {
                title: 'Reads',
                url: '/admin/item-reads',
                permission: 'item view',
            },
            {
                title: 'Top Reads',
                url: '/admin/top-item-reads',
                permission: 'item view',
            },
            {
                title: 'Downloads',
                url: '/admin/item-downloads',
                permission: 'item view',
            },
            {
                title: 'Top Downloads',
                url: '/admin/top-item-downloads',
                permission: 'item view',
            },
        ],
    },
    {
        title: 'Posts',
        url: '/admin/posts',
        icon: FilesIcon,
        activeList: ['/admin/posts', '/admin/post-categories'],
        permission: 'post view',
        items: [
            {
                title: 'All Posts',
                url: '/admin/posts',
                permission: 'post view',
            },
            {
                title: 'Categories',
                url: '/admin/post-categories',
                permission: 'post_category view',
            },
        ],
    },
    {
        title: 'Website Settings',
        url: '/admin/website-infos',
        icon: SettingsIcon,
        permission: 'website_info view',
        items: [
            {
                title: 'Website Info',
                url: '/admin/website-infos',
                permission: 'website_info view',
            },
            {
                title: 'Pages',
                url: '/admin/pages',
                permission: 'page view',
            },
            {
                title: 'Links',
                url: '/admin/links',
                permission: 'link view',
            },
            {
                title: 'Key Values',
                url: '/admin/key-values',
                permission: 'key_value view',
            },
            {
                title: 'FAQ',
                url: '/admin/faqs',
                permission: 'faq view',
            },
            {
                title: 'Banners',
                url: '/admin/banners',
                permission: 'banner view',
            },
        ],
    },
    {
        title: 'Subscriptions',
        url: '/admin/subscriptions',
        icon: CreditCardIcon,
        permission: 'subscription view',
        items: [
            {
                title: 'Subscriptions',
                url: '/admin/subscriptions',
                permission: 'subscription view',
            },
            {
                title: 'Plans',
                url: '/admin/plans',
                permission: 'plan view',
            },
        ],
    },

    {
        title: 'Types',
        url: '/admin/types',
        icon: ShapesIcon,
        permission: 'type view',
        items: [
            {
                title: 'All Types',
                url: '/admin/types',
                permission: 'type view',
            },
            {
                title: 'Type Groups',
                url: '/admin/type-groups',
                permission: 'type_group view',
            },
        ],
    },
    {
        title: 'Locations',
        url: '/admin/locations',
        icon: MapPinHouseIcon,
        permission: 'location view',
    },
    {
        title: 'Languages',
        url: '/admin/languages',
        icon: LanguagesIcon,
        permission: 'language view',
    },
];

const footerNavItems: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    permission?: string;
    activeList?: string[];
}[] = [
    {
        title: 'Sources Hub',
        url: '#',
        icon: Folder,
        permission: 'source_hub view',
    },
    {
        title: 'Sample Content',
        url: '/admin/sample-content',
        icon: BookOpen,
        permission: 'sample_content view',
    },
];

export function AppSidebar() {
    const { user_library, auth } = usePage<any>().props;

    const libCode = user_library?.code; // e.g., 'L001'

    const libraryDashboardNavItems: {
        title: string;
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
            title: 'Circulations',
            url: `/dashboard/library/${libCode}/all-circulations`,
            icon: ArrowLeftRightIcon,
            activeList: [
                `/dashboard/library/${libCode}/all-circulations`,
                `/dashboard/library/${libCode}/circulations-checkout`,
                `/dashboard/library/${libCode}/circulations-checkin`,
                `/dashboard/library/${libCode}/circulation-rules`,
            ],
            permission: '',
            items: [
                {
                    title: 'All Circulations',
                    url: `/dashboard/library/${libCode}/all-circulations`,
                    permission: '',
                },
                {
                    title: 'Circulation Rule',
                    url: `/dashboard/library/${libCode}/circulation-rules`,
                    permission: '',
                },
            ],
        },
        {
            title: 'Items',
            url: `/dashboard/library/${libCode}/items`,
            icon: LayoutList,
            activeList: [
                `/dashboard/library/${libCode}/items`,
                `/dashboard/library/${libCode}/item-categories`,
                `/dashboard/library/${libCode}/items-physical-copies`,
                `/dashboard/library/${libCode}/item-types`,
                `/dashboard/library/${libCode}/shelf-locations`,
            ],
            permission: '',
            items: [
                {
                    title: 'All Items',
                    url: `/dashboard/library/${libCode}/items`,
                    permission: '',
                },
                {
                    title: 'Item Categories',
                    url: `/dashboard/library/${libCode}/item-categories`,
                    permission: '',
                },
                {
                    title: 'Physical Copies',
                    url: `/dashboard/library/${libCode}/items-physical-copies`,
                    permission: '',
                },
                {
                    title: 'Item Types',
                    url: `/dashboard/library/${libCode}/item-types`,
                    permission: '',
                },
                {
                    title: 'Shelf Locations',
                    url: `/dashboard/library/${libCode}/shelf-locations`,
                    permission: '',
                },
            ],
        },
        {
            title: 'Users',
            url: `/dashboard/library/${libCode}/users`,
            icon: UsersIcon,
            activeList: [`/dashboard/library/${libCode}/users`, `/dashboard/library/${libCode}/user-categories`],
            permission: '',
            items: [
                {
                    title: 'All Users',
                    url: `/dashboard/library/${libCode}/users`,
                    permission: '',
                },
                {
                    title: 'User Categories',
                    url: `/dashboard/library/${libCode}/user-categories`,
                    permission: '',
                },
            ],
        },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {user_library?.code && ['Owner', 'Staff'].includes(auth?.user?.library_role) && (
                    <>
                        <Separator />
                        <NavMain label="Library Menu" items={libraryDashboardNavItems} />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
