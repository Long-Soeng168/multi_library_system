import { PostCard } from '@/components/Card/PostCard';
import LoadingOnPrefetch from '@/components/Loading/LoadingOnPrefetch';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import { TagFilter } from '@/components/tag-filter';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { formatToKhmerDateTime } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

const Index = () => {
    const { tableData, totalDataCount, categories } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <FrontPageLayout>
            <div className="relative min-h-screen bg-background">
                {/* Background Grid */}
                <div className="absolute top-[5px] left-0 z-0 h-[100px] w-full mask-[linear-gradient(to_top,transparent_25%,black_95%)]">
                    <FlickeringGrid className="absolute top-0 left-0 size-full" />
                </div>

                {/* Header Section */}
                <div className="relative z-10 flex min-h-[100px] flex-col justify-center gap-6 pt-10">
                    <div className="section-container mx-auto w-full">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-medium tracking-tighter md:text-5xl">{t('Posts')}</h1>
                            <p className="text-sm text-muted-foreground md:text-base lg:text-lg">
                                {t('Latest posts and updates from RULE Library.')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="section-container mt-4 flex flex-1">
                    <TableDataSearch className="rounded-none" placeholder={t('Search Posts...')} />
                </div>
                <div className="h-6">
                    <LoadingOnPrefetch />
                </div>
                {categories.length > 0 && (
                    <div className="section-container z-20 mx-auto mb-6 w-full">
                        <TagFilter tags={[{ name: t('All Category'), code: '', posts_count: totalDataCount }, ...categories]} />
                    </div>
                )}

                {/* Blog List */}
                <div className="section-container mb-10">
                    <div className={`relative grid grid-cols-1 overflow-hidden md:grid-cols-2 lg:grid-cols-3`}>
                        {tableData?.data?.map((item: any) => {
                            return (
                                <PostCard
                                    key={item.id}
                                    url={`/posts/${item.id}`}
                                    title={currentLocale == 'kh' ? (item.title_kh ?? item.title) : item.title}
                                    categoryName={currentLocale == 'kh' ? (item.category?.name_kh ?? item.category?.name) : item.category?.name}
                                    description={
                                        currentLocale == 'kh' ? (item.short_description_kh ?? item.short_description) : item.short_description
                                    }
                                    date={formatToKhmerDateTime(item.created_at, false)}
                                    thumbnail={`/assets/images/posts/thumb/${item.thumbnail}`}
                                />
                            );
                        })}
                    </div>

                    <PaginationTabs containerClassName="px-0" />
                </div>
            </div>
        </FrontPageLayout>
    );
};

export default Index;
