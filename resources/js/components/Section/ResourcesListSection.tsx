import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import HoverButton from '../Button/HoverButton';
import BookCardHoverGradient from '../Card/BookCardHoverGradient';
import { ContentHeader } from '../Header/ContentHeader';
import NoDataDisplay from '../NoDataDisplay';
import { PlaceholderPattern } from '../ui/placeholder-pattern';

export default function ResourcesListSection({ containerClassName }: { containerClassName?: string }) {
    const { mainCategories, search } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <div className={cn('section-container', containerClassName)}>
            <div className="space-y-20">
                {mainCategories?.length > 0 ? (
                    mainCategories.map((mainCate: any) => (
                        <div key={mainCate.code}>
                            <div>
                                <ContentHeader
                                    link={`/resources/${mainCate.code}?search=${mainCate.items?.length > 0 ? search || '' : ''}`}
                                    title={currentLocale == 'kh' ? (mainCate?.name_kh ?? mainCate?.name) : mainCate?.name}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                                {mainCate.items?.map((item: any) => (
                                    <Link key={item.id} href={`/resources/detail/${item.id}`}>
                                        <BookCardHoverGradient
                                            title={item.name_kh ?? item.name}
                                            subTitle={item.name_kh ? item.name : ''}
                                            image_url={`/assets/images/items/thumb/${item.thumbnail}`}
                                        />
                                    </Link>
                                ))}

                                <div className="relative z-10 flex h-full min-h-40 w-full items-center justify-center overflow-hidden rounded-md border-2 border-background pl-6 shadow dark:border-border">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                                    <Link href={`/resources/${mainCate.code}?search=${mainCate.items?.length > 0 ? search || '' : ''}`} prefetch>
                                        <HoverButton />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <NoDataDisplay />
                )}
            </div>
        </div>
    );
}
