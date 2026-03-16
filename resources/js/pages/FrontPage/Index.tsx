import SpaceAnimateButton from '@/components/Button/SpaceAnimateButton';
import { ContentHeader } from '@/components/Header/ContentHeader';
import Feature2 from '@/components/Section/Feature2';
import { Feature3 } from '@/components/Section/Feature3';
import Hero from '@/components/Section/Hero';
import HeroFooter from '@/components/Section/HeroFooter';
import LibraryCards from '@/components/Section/LibraryCards';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const Index = () => {
    const { website_info, app_url, thesisCategories, publicationCategories } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const description =
        currentLocale === 'kh' ? website_info?.short_description_kh || website_info?.short_description : website_info?.short_description;
    const keywords = currentLocale === 'kh' ? website_info?.keywords_kh || website_info?.keywords : website_info?.keywords;
    const title = currentLocale === 'kh' ? website_info?.name_kh || website_info?.name : website_info?.name;
    const image = `${app_url}/assets/images/website_infos/${website_info.logo}`;
    return (
        <FrontPageLayout>
            <Head>
                {/* Basic Meta */}
                <title>{title}</title>
                {description && <meta name="description" content={description} />}
                {keywords && <meta name="keywords" content={keywords} />}

                {/* Open Graph */}
                <meta property="og:title" content={title} />
                {description && <meta property="og:description" content={description} />}

                <meta property="og:image" content={image} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={app_url} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                {description && <meta name="twitter:description" content={description} />}
                <meta name="twitter:image" content={image} />
            </Head>

            {/* Search bar */}
            <Hero />

            <LibraryCards />

            {/* Resources Hightligh */}
            <Feature2 />

            <div className="section-container my-20 flex justify-center">
                <Link href={`/resources`}>
                    <SpaceAnimateButton title={t('See All Resources')} />
                </Link>
            </div>

            <HeroFooter />
        </FrontPageLayout>
    );
};

export default Index;
