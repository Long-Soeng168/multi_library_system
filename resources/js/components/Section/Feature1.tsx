import { Button } from '@/components/ui/button';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { ContentHeader } from '../Header/ContentHeader';
import SmartLink from '../Link/SmartLink';

export default function Feature1() {
    const { whatWeOfferHeader } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <section className="section-container mt-20">
            <ContentHeader
                containerClassName='text-center'
                title={currentLocale === 'kh' ? whatWeOfferHeader?.name_kh || whatWeOfferHeader?.name : whatWeOfferHeader?.name}
                description={
                    currentLocale === 'kh'
                        ? whatWeOfferHeader?.short_description_kh || whatWeOfferHeader?.short_description
                        : whatWeOfferHeader?.short_description
                }
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {whatWeOfferHeader?.children?.map((item: any) => (
                    <FeatureCard
                        key={item.id}
                        icon={<img src={`/assets/images/pages/thumb/${item.icon}`} className="h-8 w-8 text-true-primary" />}
                        title={currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}
                        description={currentLocale === 'kh' ? item?.short_description_kh || item?.short_description : item?.short_description}
                        link={item?.link}
                        linkText={currentLocale === 'kh' ? item?.button_title_kh || item?.button_title : item?.button_title}
                    />
                ))}
            </div>
        </section>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    linkText: string;
}

const FeatureCard = ({ icon, title, description, link, linkText }: FeatureCardProps) => (
    <div className="relative flex flex-col justify-between rounded-2xl border p-6 dark:border-neutral-700">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <div className="flex h-full flex-col justify-between gap-4">
            <div className="space-y-4">
                <div className="w-fit rounded-lg bg-primary/20 p-2">{icon}</div>
                <h3 className="text-xl font-semibold text-black dark:text-white">{title}</h3>
                <p className="text-sm text-black dark:text-neutral-400">{description}</p>
            </div>
            <SmartLink href={link} prefetch>
                <Button variant="outline" className="mt-2">
                    {linkText}
                </Button>
            </SmartLink>
        </div>
    </div>
);
