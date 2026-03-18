import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons
import SocialShareButtons from '@/components/Button/SocialShareButtons';
import { BookOpen, ExternalLink, Globe, Info, Mail, MapPin, Phone } from 'lucide-react';
import ResourcesSection from './ResourcesSection';

const Show = () => {
    const { t, currentLocale } = useTranslation();
    const { libraryInfo } = usePage<any>().props;

    const [activeTab, setActiveTab] = useState('resources');
    const contactSectionRef = useRef<HTMLDivElement>(null);

    // Scroll and URL handler
    const handleContactClick = () => {
        setActiveTab('info');

        // Update URL hash
        const url = new URL(window.location.href);
        url.hash = 'contact';
        window.history.pushState({}, '', url);

        // Scroll logic
        setTimeout(() => {
            contactSectionRef?.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 150);
    };

    // Handle direct visits to #contact URL
    useEffect(() => {
        if (window.location.hash === '#contact') {
            handleContactClick();
        }
    }, []);

    const isKh = currentLocale === 'kh';

    const libName = isKh ? libraryInfo?.name_kh || libraryInfo?.name : libraryInfo?.name;
    const libDescription = isKh ? libraryInfo?.short_description_kh || libraryInfo?.short_description : libraryInfo?.short_description;

    const coverImage = libraryInfo?.banner ? `/assets/images/libraries/${libraryInfo.banner}` : '/images/default-banner.jpg';
    const logoImage = libraryInfo?.image ? `/assets/images/libraries/${libraryInfo.image}` : null;

    return (
        <FrontPageLayout>
            <Head title={`${libName} | ${t('Library Profile')}`} />

            {/* 1. Hero / Header Section */}
            <div className="relative w-full bg-background">
                <div className="group relative h-60 w-full overflow-hidden sm:h-80 lg:h-96">
                    <img src={coverImage} className="h-full w-full object-cover transition-transform duration-700" alt={libName} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="relative -mt-24 flex flex-col items-start gap-6 pb-6 sm:-mt-32 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
                            <div className="relative shrink-0 rounded-3xl bg-background shadow-lg">
                                <Avatar className="h-32 w-32 rounded-2xl border sm:h-44 sm:w-44">
                                    <AvatarImage src={logoImage ?? ''} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-4xl font-black text-primary">{libName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="space-y-4 py-2">
                                <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">{libName}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground sm:text-base">
                                    <span className="flex items-center gap-1.5 transition-colors hover:text-primary">
                                        <MapPin className="h-4 w-4 text-primary" /> {libraryInfo?.address}
                                    </span>
                                </div>
                                <SocialShareButtons title={libName} url={window.location.href} />
                            </div>
                        </div>

                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <Button
                                onClick={handleContactClick}
                                size="lg"
                                className="flex-1 rounded-sm font-bold shadow-lg shadow-primary/20 sm:flex-none"
                            >
                                <Mail className="mr-2 h-4 w-4" /> {t('Contact')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Navigation & Content */}
            <main className="container mx-auto px-4 py-12">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="inline-flex h-12 w-full justify-start gap-2 bg-transparent p-0 sm:w-auto">
                        <TabsTrigger
                            value="resources"
                            onClick={() => {
                                // Clear the hash from the URL
                                window.history.pushState({}, '', window.location.pathname);
                            }}
                            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pt-2 text-lg font-bold transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
                        >
                            <BookOpen className="mr-2 h-5 w-5" />
                            {t('Resources')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="info"
                            className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pt-2 text-lg font-bold transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
                        >
                            <Info className="mr-2 h-5 w-5" />
                            {t('Library Info')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="resources" className="focus-visible:ring-0">
                        <ResourcesSection />
                    </TabsContent>

                    <TabsContent value="info" className="focus-visible:ring-0">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <section className="lg:col-span-2">
                                <div className="space-y-8">
                                    <div className="rounded-lg border bg-card p-4 sm:p-6">
                                        <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold">
                                            <Info className="text-primary" size={24} />
                                            {t('About Library')}
                                        </h3>
                                        <p
                                            className={`leading-relaxed whitespace-pre-line text-muted-foreground ${isKh ? 'text-lg leading-loose' : 'text-base'}`}
                                        >
                                            {libDescription}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <aside id="contact" ref={contactSectionRef} className="scroll-mt-24">
                                <div className="rounded-lg border border-border/50 from-muted/30 to-background p-2 transition-colors duration-300">
                                    <div className="space-y-6">
                                        <div className="space-y-1.5 p-4 pb-0">
                                            <h3 className="text-xs font-semibold tracking-tight text-foreground/70">{t('Direct connect')}</h3>
                                            <div className="h-0.5 w-6 rounded-full bg-primary/30" />
                                        </div>

                                        <div className="space-y-1">
                                            <ContactAction
                                                icon={<Phone size={18} strokeWidth={1.5} />}
                                                label={t('Phone')}
                                                value={libraryInfo?.phone}
                                                href={`tel:${libraryInfo?.phone}`}
                                            />

                                            <ContactAction
                                                icon={<Mail size={18} strokeWidth={1.5} />}
                                                label={t('Email')}
                                                value={libraryInfo?.email}
                                                href={`mailto:${libraryInfo?.email}`}
                                            />

                                            {libraryInfo?.website_url && (
                                                <ContactAction
                                                    icon={<Globe size={18} strokeWidth={1.5} />}
                                                    label={t('Website')}
                                                    value={libraryInfo.website_url.replace(/^https?:\/\//, '')}
                                                    href={libraryInfo.website_url}
                                                />
                                            )}
                                        </div>

                                        <div className="border-t border-border/40 px-4 pt-2">
                                            <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                                                <span className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                                                    {libraryInfo?.opening_days}
                                                </span>
                                                <span className="font-medium">{libraryInfo?.opening_hours}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </FrontPageLayout>
    );
};

const ContactAction = ({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) => (
    <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-muted/50"
    >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground shadow-sm transition-colors group-hover:border-primary/30 group-hover:text-primary">
            {icon}
        </div>

        <div className="min-w-0 flex-1">
            <p className="mb-0.5 text-[11px] text-muted-foreground/60">{label}</p>
            <p className="truncate text-sm font-semibold text-foreground/80 transition-colors group-hover:text-primary">{value}</p>
        </div>

        <ExternalLink
            size={13}
            className="-translate-x-2 text-primary/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        />
    </a>
);

export default Show;
