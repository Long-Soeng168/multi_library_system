import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import '../../css/ckeditor.css';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { website_info } = usePage<any>().props;

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {website_info?.primary_color && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                :root {
                    --primary: ${website_info?.primary_color || '#000'};
                    --primary-foreground: ${website_info?.primary_foreground_color || '#fff'};
                    --true-primary: ${website_info?.primary_color || '#000'};
                }
                .dark {
                    --primary: #fff;
                    --primary-foreground: #000;
                    --true-primary: ${website_info?.primary_color || '#000'};
                }
            `,
                    }}
                />
            )}

            {children}
            <Toaster />
        </AppLayoutTemplate>
    );
};
