import { ChevronDown, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export function NavMain({
    items,
    label,
}: {
    items: {
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
    }[];
    label?: string;
}) {
    const { t } = useTranslation();
    const hasPermission = usePermission();

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{t(label)}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    if (item.permission && !hasPermission(item.permission)) {
                        return null;
                    }

                    const pathname = typeof window == 'undefined' ? '' : window.location.pathname;

                    // Check if current path is inside this menu group
                    const isActive =
                        pathname.startsWith(item.url) || // matches parent url
                        item.activeList?.some((p) => pathname.startsWith(p)) || // matches activeList
                        item.items?.some((sub) => pathname.startsWith(sub.url)); // matches sub urls

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <div className="flex w-full items-center gap-2">
                                    <Link prefetch href={item.url} className="flex flex-1">
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            className={cn(
                                                'group cursor-pointer rounded duration-300 hover:bg-primary hover:text-primary-foreground',
                                                isActive && 'font-semibold text-primary',
                                                `group-[${item.title}]`,
                                            )}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{t(item.title)}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                    {item.items && item.items.length > 0 && (
                                        <span
                                            className={cn(
                                                'flex items-center justify-center rounded duration-300 hover:bg-primary hover:text-primary-foreground',
                                                isActive && 'text-primary',
                                            )}
                                        >
                                            <CollapsibleTrigger className={cn('cursor-pointer p-1')}>
                                                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                                            </CollapsibleTrigger>
                                        </span>
                                    )}
                                </div>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            if (subItem.permission && !hasPermission(subItem.permission)) {
                                                return null;
                                            }

                                            const isActiveSub = pathname === subItem.url || pathname.startsWith(subItem.url + '/');
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className={cn(
                                                            'rounded hover:bg-primary hover:text-primary-foreground',
                                                            isActiveSub && 'font-medium text-primary underline underline-offset-4',
                                                        )}
                                                    >
                                                        <Link prefetch href={subItem.url}>
                                                            <span>{t(subItem.title)}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
