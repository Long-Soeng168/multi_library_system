import SpaceAnimateButton from '@/components/Button/SpaceAnimateButton';
import { ContentHeader } from '@/components/Header/ContentHeader';
import Feature2 from '@/components/Section/Feature2';
import { Feature3 } from '@/components/Section/Feature3';
import Feature6 from '@/components/Section/Feature6';
import Hero from '@/components/Section/Hero';
import PostsHomePageSection from '@/components/Section/PostsHomePageSection';
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

            {/* Posts Section */}
            <PostsHomePageSection />

            {/* Resources Hightligh */}
            <Feature2 />

            {/* Theses Major */}
            <div className="section-container mt-20">
                <ContentHeader title={t('Thesis by Major')} description={t('Browse all theses, organized by major.')} />

                <Feature3 data={thesisCategories} />
            </div>

            <div className="section-container mt-20">
                <ContentHeader title={t('Publications by Categories')} description={t('Browse all publications, organized by category.')} />

                <Feature3 data={publicationCategories} />
            </div>

            {/* Libraries Statistics */}
            <div className="section-container mt-40">
                <ContentHeader
                    title={t('Library Overview')}
                    description={t('A quick look at how our library is being used — from online reads to in-person visits.')}
                />

                <Feature6 />
            </div>

            {/* What We Offer */}
            {/* <Feature1 /> */}

            {/* Accordion */}
            {/* <div className="section-container mt-20">
                <Accordion1 />
            </div> */}

            <div className="section-container my-20 flex justify-center">
                <Link href={`/resources`}>
                    <SpaceAnimateButton title={t('See All Resources')} />
                </Link>
            </div>
        </FrontPageLayout>
    );
};

export default Index;
