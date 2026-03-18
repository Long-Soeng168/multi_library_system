import ResourceDetail from '@/components/Section/ResourceDetail';
import ScrollCardSection from '@/components/Section/ScrollCardSection';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Head, usePage } from '@inertiajs/react';
import ItemPhysicalCopyFrontDisplay from './ItemPhysicalCopyFrontDisplay';

const Show = () => {
    const { mainCategory, showData, app_url } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const description = currentLocale === 'kh' ? showData?.short_description_kh || showData?.short_description : showData?.short_description;
    const title = currentLocale === 'kh' ? showData?.name_kh || showData?.name : showData?.name;
    const keywords = showData?.keywords;
    const image = `${app_url}/assets/images/items/thumb/${showData?.thumbnail}`;

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

            <section className="section-container">
                <div className="my-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/resources">{t('Resources')}</BreadcrumbLink>
                            </BreadcrumbItem>
                            {/* {mainCategory?.name && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/libraries/${showData?.library?.id}`}>
                                            {currentLocale == 'kh' ? (mainCategory.name_kh ?? mainCategory.name) : mainCategory?.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )} */}
                            {showData?.library?.id && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/libraries/${showData?.library?.id} || ''}`}>
                                            {currentLocale == 'kh'
                                                ? (showData?.library?.name_kh ?? showData?.library?.name)
                                                : showData?.library?.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            {showData?.category?.parent && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            href={`/libraries/${showData?.library?.id}?category_code=${showData?.category?.parent?.code || ''}`}
                                        >
                                            {currentLocale == 'kh'
                                                ? (showData?.category?.parent.name_kh ?? showData?.category?.parent.name)
                                                : showData?.category?.parent.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            {showData?.category && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/libraries/${showData?.library?.id}?category_code=${showData?.category?.code || ''}`}>
                                            {currentLocale == 'kh'
                                                ? (showData?.category?.name_kh ?? showData?.category?.name)
                                                : showData?.category?.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}

                            {showData?.id && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink
                                            href={`/resources/detail/${showData?.id}`}
                                            className="line-clamp-1 max-w-[30ch] text-foreground lg:max-w-[60ch]"
                                        >
                                            {currentLocale == 'kh' ? (showData?.name_kh ?? showData?.name) : showData?.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <ResourceDetail />
                    <ItemPhysicalCopyFrontDisplay />
                </div>
            </section>
            <section className="mt-20 mb-20">
                <ScrollCardSection containerClassName="mt-8" />
            </section>
        </FrontPageLayout>
    );
};

export default Show;
