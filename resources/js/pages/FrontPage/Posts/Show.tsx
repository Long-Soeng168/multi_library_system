import { PostCard } from '@/components/Card/PostCard';
import UploadedFile from '@/components/Form/UploadedFileDisplay';
import PostmagesGallery from '@/components/GalleryViewer/PostmagesGallery';
import { ContentHeader } from '@/components/Header/ContentHeader';
import { MobileTableOfContents } from '@/components/TableContent/mobile-table-of-contents';
import { TableOfContents } from '@/components/TableContent/table-of-contents';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { formatToKhmerDateTime } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import { FilesIcon } from 'lucide-react';

const Show = () => {
    const { showData, relatedData, app_url } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const description = currentLocale === 'kh' ? showData?.short_description_kh || showData?.short_description : showData?.short_description;
    const title = currentLocale === 'kh' ? showData?.title_kh || showData?.title : showData?.title;
    const image = `${app_url}/assets/images/posts/thumb/${showData?.images[0]?.image}`;

    return (
        <FrontPageLayout>
            <Head>
                {/* Basic Meta */}
                <title>{title}</title>
                <meta name="description" content={description} />

                {/* Open Graph */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={app_url} />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
            </Head>

            <ScrollProgress className="top-0 h-[4px]" />
            <div className="section-container">
                <div className="relative z-10 mx-auto flex lg:border-0">
                    <main className="w-full overflow-hidden pb-20 lg:border-r-0 lg:pr-6">
                        <div className="pt-4 pb-2">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/posts" className="">
                                            {t('Posts')}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    {showData?.category?.id && (
                                        <>
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href={`/posts?category_code=${showData?.category_code}`} className="">
                                                    {currentLocale == 'kh'
                                                        ? (showData?.category?.name_kh ?? showData?.category?.name)
                                                        : showData?.category?.name}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                        </>
                                    )}
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="#" className="text-foreground">
                                            {currentLocale == 'kh' ? (showData.title_kh ?? showData.title) : showData.title}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="prose w-full max-w-none dark:prose-invert prose-h2:mb-0.5 prose-h3:mb-0.5 prose-p:m-0 prose-ul:m-0">
                            <h1 className="mt-6 text-2xl leading-tight text-primary md:text-3xl">
                                {currentLocale == 'kh' ? (showData.title_kh ?? showData.title) : showData.title}
                            </h1>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        currentLocale == 'kh'
                                            ? (showData.long_description_kh ?? showData.long_description)
                                            : showData.long_description,
                                }}
                            ></div>
                        </div>

                        {showData?.images?.length > 0 && (
                            <PostmagesGallery
                                label={t('Images')}
                                images={showData?.images}
                                containerClassName="pt-8"
                                basePath="/assets/images/posts/"
                            />
                        )}

                        {showData?.files?.length > 0 && (
                            <>
                                <h2 className="mt-8 flex items-center gap-1 text-base font-bold">
                                    <FilesIcon size={18} />
                                    {t('Files')}
                                </h2>
                                <UploadedFile
                                    fileClassName="bg-background rounded-sm"
                                    containerClassName="mt-0"
                                    label=""
                                    files={showData?.files}
                                    basePath="/assets/files/posts/"
                                />
                            </>
                        )}
                    </main>

                    <aside className="hidden w-[350px] shrink-0 bg-muted/60 p-6 lg:block lg:p-10 dark:bg-muted/20">
                        <div className="sticky top-20 space-y-8">
                            <TableOfContents />
                        </div>
                    </aside>
                </div>
            </div>
            {relatedData?.length > 0 && (
                <section>
                    <div className="section-container">
                        <ContentHeader
                            link={`/posts?category_code=${showData?.category_code}`}
                            title={t('Related Posts')}
                            containerClassName="mt-12"
                        />
                        <div className="section-container mb-10 px-0">
                            <div className={`relative grid grid-cols-1 overflow-hidden md:grid-cols-2 lg:grid-cols-3`}>
                                {relatedData?.map((item: any) => {
                                    return (
                                        <PostCard
                                            key={item.id}
                                            url={`/posts/${item.id}`}
                                            title={currentLocale == 'kh' ? (item.title_kh ?? item.title) : item.title}
                                            categoryName={
                                                currentLocale == 'kh' ? (item.category?.name_kh ?? item.category?.name) : item.category?.name
                                            }
                                            description={
                                                currentLocale == 'kh' ? (item.short_description_kh ?? item.short_description) : item.short_description
                                            }
                                            date={formatToKhmerDateTime(item.created_at, false)}
                                            thumbnail={`/assets/images/posts/thumb/${item.thumbnail}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <MobileTableOfContents />
        </FrontPageLayout>
    );
};

export default Show;
