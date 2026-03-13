import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import DownloadButton from '../Button/DownloadButton';
import ReadButton from '../Button/ReadButton';
import BookImagesGallery from '../GalleryViewer/BookImagesGallery';

const ResourceDetail = ({
    imageContainerClassname,
    showButtonBelowImages = true,
}: {
    imageContainerClassname?: string;
    showButtonBelowImages?: boolean;
}) => {
    const { mainCategory, showData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    let images = [];

    if (showData?.images?.length) {
        images = showData.images.map((img) => `/assets/images/items/${img?.image ?? ''}`);
    }

    images = [`/assets/images/items/${showData?.thumbnail ?? ''}`, ...images];

    return (
        <div className="flex-wrap gap-6 sm:flex">
            {/* Left Column: Title and Actions */}
            <div className={cn('sm:max-w-sm sm:min-w-xs', imageContainerClassname)}>
                <div className="flex items-center justify-center">
                    <BookImagesGallery
                        readUrl={showData?.file_name ? `/view-pdf?file_name=${showData?.file_name}&id=${showData?.id}&resource=items` : ''}
                        images={images}
                        alternative={showData?.name}
                    />
                    {/* <img src="/assets/sample_images/books/thesis1.jpg" alt="University Logo" className="h-auto w-full border border-primary" /> */}
                </div>

                {showButtonBelowImages && showData?.file_name && (
                    <div className="mt-2 flex gap-2">
                        <Link href={`/view-pdf?file_name=${showData?.file_name}&id=${showData?.id}&resource=items`} className="flex-1">
                            <ReadButton />
                        </Link>
                        <a href={`/view-pdf?file_name=${showData?.file_name}&id=${showData?.id}&resource=items&is_download=1`} className="flex-1">
                            <DownloadButton />
                        </a>
                    </div>
                )}
            </div>

            {/* Right Column: Details */}
            <div className="w-full flex-1 sm:w-auto">
                <div>
                    {showData?.name_kh && showData?.name ? (
                        <>
                            <h1 className="text-2xl font-medium">{showData.name_kh}</h1>
                            <h3 className="text-xl">{showData.name}</h3>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-medium">{showData.name}</h1>
                        </>
                    )}
                </div>
                <div className="mt-3 max-w-full space-y-2">
                    {showData?.authors?.length > 0 ? (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{mainCategory?.code == 'theses' ? t('Researched by') : t('Author')}</span>
                            <div className="flex flex-wrap items-center">
                                {showData?.authors?.length > 0 &&
                                    showData?.authors?.map((author: any, index: number) => (
                                        <span className="flex items-center" key={author?.id}>
                                            <Link
                                                href={`/resources/${mainCategory?.code}?author_id=${author?.id || ''}`}
                                                className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                                            >
                                                {currentLocale == 'kh' ? (author?.name_kh ?? author?.name) : author?.name}
                                            </Link>
                                            {index < showData.authors.length - 1 && <span className="px-2">-</span>}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        showData?.author_name && (
                            <div className="flex items-center justify-start gap-4 pb-1">
                                <span className="w-[120px] shrink-0 border-r">
                                    {mainCategory?.code == 'theses' ? t('Researched by') : t('Author')}
                                </span>
                                <span>{showData?.author_name}</span>
                            </div>
                        )
                    )}

                    {showData?.advisor && (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{t('Advisor')}</span>
                            <Link
                                href={`/resources/${mainCategory?.code}?advisor_id=${showData?.advisor?.id || ''}`}
                                className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                            >
                                {currentLocale == 'kh' ? (showData?.advisor?.name_kh ?? showData?.advisor?.name) : showData?.advisor?.name}
                            </Link>
                        </div>
                    )}

                    {showData?.category && (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{mainCategory?.code == 'theses' ? t('Bachelor') : t('Category')}</span>
                            <div className="flex flex-wrap items-center gap-2">
                                {showData?.category?.parent && (
                                    <>
                                        <Link
                                            href={`/resources/${mainCategory?.code}?category_code=${showData?.category?.parent?.code || ''}`}
                                            className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                                        >
                                            {currentLocale == 'kh'
                                                ? (showData?.category?.parent?.name_kh ?? showData?.category?.parent?.name)
                                                : showData?.category?.parent?.name}
                                        </Link>
                                        <span>/</span>
                                    </>
                                )}
                                <Link
                                    href={`/resources/${mainCategory?.code}?category_code=${showData?.category?.code || ''}`}
                                    className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                                >
                                    {currentLocale == 'kh' ? (showData?.category?.name_kh ?? showData?.category?.name) : showData?.category?.name}
                                </Link>
                            </div>
                        </div>
                    )}

                    {showData?.publisher && (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{t('Publisher')}</span>
                            <Link
                                href={`/resources/${mainCategory?.code}?publisher_id=${showData?.publisher?.id || ''}`}
                                className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                            >
                                {currentLocale == 'kh' ? (showData?.publisher?.name_kh ?? showData?.publisher?.name) : showData?.publisher?.name}
                            </Link>
                        </div>
                    )}

                    {showData?.language && (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{t('Language')}</span>
                            <Link
                                href={`/resources/${mainCategory?.code}?category_code=${showData?.category?.code || ''}&language_code=${showData?.language?.code || ''}`}
                                className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                            >
                                {currentLocale == 'kh' ? (showData?.language?.name_kh ?? showData?.language?.name) : showData?.language?.name}
                            </Link>
                        </div>
                    )}
                    {showData?.published_year && (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{t('Year')}</span>
                            <Link
                                href={`/resources/${mainCategory?.code}?category_code=${showData?.category?.code || ''}&from_year=${showData?.published_year || ''}`}
                                className="line-clamp-2 cursor-pointer text-primary underline-offset-4 hover:underline"
                            >
                                {showData?.published_year}
                            </Link>
                        </div>
                    )}

                    {showData?.total_page && (
                        <div className="flex items-center justify-start gap-4 pb-1">
                            <span className="w-[120px] shrink-0 border-r">{t('Pages')}</span>
                            <span>{showData?.total_page}</span>
                        </div>
                    )}
                </div>
                {showData?.long_description && (
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold">{t('Description')}</h3>
                        <div
                            className="prose mt-2 w-full max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                                __html:
                                    currentLocale == 'kh' ? (showData.long_description_kh ?? showData.long_description) : showData.long_description,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceDetail;
