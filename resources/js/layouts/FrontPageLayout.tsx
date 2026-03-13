import ScrollToTopButton2 from '@/components/Button/ScrollToTopButton2';
import Footer from '@/components/Footer/Footer';
import BottomNavbarHideAndShow from '@/components/Navbar/BottomNavbarHideAndShow';
import Navbar2 from '@/components/Navbar/Navbar2';
import NavbarHideAndShow from '@/components/Navbar/NavbarHideAndShow';
import { usePage } from '@inertiajs/react';
import React from 'react';

export default function FrontPageLayout({ children }: { children: React.ReactNode }) {
    const { website_info } = usePage<any>().props;

    return (
        <div className="flex min-h-screen flex-col">
            {website_info?.primary_color && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                :root {
                    --primary: ${website_info?.primary_color};
                    --primary-foreground: ${website_info?.primary_foreground_color || '#fff'};
                    --true-primary: ${website_info?.primary_color};
                }
                .dark {
                    --primary: #fff;
                    --primary-foreground: #000;
                    --true-primary: ${website_info?.primary_color};
                }
            `,
                    }}
                />
            )}
            <Navbar2 />
            <NavbarHideAndShow />
            <div className="min-h-screen flex-1 bg-background">
                <main>{children}</main>
            </div>

            <Footer />

            {/* <ScrollToTopButton /> */}
            <ScrollToTopButton2 />
            {/* <BottomNavbarHideAndShow /> */}
        </div>
    );
}
