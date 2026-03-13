import NavLanguage from '@/components/Navbar/NavLanguage';
import { SwitchDarkModeSmoothAnimated } from '@/components/Switch/SwitchDarkModeSmoothAnimated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRightLeft, LayoutIcon } from 'lucide-react';
import React from 'react';
import { Toaster } from 'sonner';

interface Props {
    children: React.ReactNode;
}

export default function CheckinAndCheckoutLayout({ children }: Props) {
    const { url } = usePage();
    const { t } = useTranslation();

    const isCheckout = url.startsWith('/admin/circulations-checkout');
    const isCheckin = url.startsWith('/admin/circulations-checkin');

    return (
        <>
            <Toaster />
            <Head title="Circulation Desk" />

            {/* Reduced margins for mobile (my-6 vs my-10) */}
            <div className="section-container my-6 px-4 md:my-6 md:px-6">
                {/* HEADER SECTION */}
                <div className="mb-4 flex flex-col gap-6 border-b border-border/60 pb-6 md:mb-4 md:flex-row md:items-center md:justify-between md:pb-6">
                    {/* Top Row: Title & Action Icons */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div
                                className={cn(
                                    'relative flex size-10 items-center justify-center rounded-md bg-primary/10 transition-transform active:scale-95 md:size-12',
                                    isCheckout ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-600',
                                )}
                            >
                                <ArrowRightLeft className="size-5 md:size-6" />
                                <div
                                    className={cn(
                                        'absolute -top-0.5 -right-0.5 size-3 rounded-full border-2 border-background',
                                        isCheckout ? 'bg-blue-500' : 'bg-green-500',
                                    )}
                                />
                            </div>
                            <div>
                                <h1 className="mb-0.5 text-xl font-black tracking-tight text-foreground md:text-2xl">{t('Circulation')}</h1>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground uppercase">{t('Mode')}</p>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'overflow-hidden rounded border-none px-1.5 text-sm md:text-base',
                                            isCheckout ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-600',
                                        )}
                                    >
                                        {isCheckout ? t('Check Out') : t('Check In')}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Mobile-only Quick Actions */}
                        <div className="flex items-center gap-2 md:hidden">
                            <NavLanguage />
                            <SwitchDarkModeSmoothAnimated />
                        </div>
                    </div>

                    {/* Navigation & Desktop Controls */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        {/* Segmented Control - Full width on mobile */}
                        <div className="flex w-full items-center gap-1 rounded-xl border bg-muted/30 p-1 md:w-auto md:rounded-lg">
                            <Link href="/admin/circulations-checkout" className="relative flex-1">
                                <button
                                    className={cn(
                                        'w-full shrink-0 cursor-pointer rounded-md px-4 py-2.5 font-semibold whitespace-nowrap transition-all duration-200 md:rounded-sm md:py-1.5',
                                        isCheckout
                                            ? 'bg-background text-primary ring-1 ring-black/5 dark:bg-zinc-800'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {t('Check Out')}
                                </button>
                                {isCheckout && (
                                    <span className="absolute -bottom-0.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-primary shadow-[0_-1px_4px_rgba(var(--primary),0.4)]" />
                                )}
                            </Link>

                            <Link href="/admin/circulations-checkin" className="relative flex-1">
                                <button
                                    className={cn(
                                        'w-full shrink-0 cursor-pointer rounded-md px-4 py-2.5 font-semibold whitespace-nowrap transition-all duration-200 md:rounded-sm md:py-1.5',
                                        isCheckin
                                            ? 'bg-background text-primary ring-1 ring-black/5 dark:bg-zinc-800'
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {t('Check In')}
                                </button>
                                {isCheckin && (
                                    <span className="absolute -bottom-0.5 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-primary shadow-[0_-1px_4px_rgba(var(--primary),0.4)]" />
                                )}
                            </Link>
                        </div>
                        <div className="mx-2 hidden h-6 w-px bg-border/80 md:block" />

                        {/* Desktop-only secondary controls */}
                        <div className="hidden items-center gap-2 md:flex">
                            <NavLanguage />
                            <div className="mx-2 h-6 w-px bg-border/80" />
                            <Link href="/dashboard">
                                <Button variant="secondary" size="sm" className="h-9 rounded-sm border font-medium hover:border-primary">
                                    <LayoutIcon className="mr-1 size-4" /> {t('Dashboard')}
                                </Button>
                            </Link>
                            <SwitchDarkModeSmoothAnimated />
                        </div>

                        {/* Mobile Dashboard Link - Compact */}
                        <Link href="/dashboard" className="md:hidden">
                            <Button variant="outline" className="w-full justify-center border-dashed py-5 text-sm text-muted-foreground">
                                <LayoutIcon className="mr-2 size-4" /> {t('Return to Dashboard')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* PAGE CONTENT */}
                <main className="duration-500 animate-in fade-in slide-in-from-bottom-2">{children}</main>
            </div>
        </>
    );
}
