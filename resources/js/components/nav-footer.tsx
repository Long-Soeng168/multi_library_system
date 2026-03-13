import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        permission?: string;
        activeList?: string[];
    }[];
}) {
    const { t } = useTranslation();
    const hasPermission = usePermission();

    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        if (item.permission && !hasPermission(item.permission)) {
                            return null;
                        }

                        const pathname = typeof window == 'undefined' ? '' : window.location.pathname;

                        // Check if current path is inside this menu group
                        const isActive =
                            pathname.startsWith(item.url) || // matches parent url
                            item.activeList?.some((p) => pathname.startsWith(p));

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        'group cursor-pointer rounded duration-300 hover:bg-primary hover:text-primary-foreground',
                                        isActive && 'font-semibold text-primary',
                                    )}
                                >
                                    <Link href={item.url} prefetch rel="noopener noreferrer">
                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                        <span>{t(item.title)}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
