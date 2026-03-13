import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import HoverButton from '../Button/HoverButton';
import BookCardHoverGradient from '../Card/BookCardHoverGradient';
import { ContentHeader } from '../Header/ContentHeader';
import NoDataDisplay from '../NoDataDisplay';
import { PlaceholderPattern } from '../ui/placeholder-pattern';

export default function ScrollCardSection({ title, containerClassName }: { title?: string; containerClassName?: string }) {
    const { showData, mainCategory, relatedData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    return (
        <div className={cn('section-container', containerClassName)}>
            <div>
                <ContentHeader
                    link={`/resources/${mainCategory?.code}?category_code=${showData?.category?.code || ''}`}
                    title={title || t('Related')}
                />
            </div>
            {relatedData?.length > 0 ? (
                <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5')}>
                    {relatedData?.map((item: any) => (
                        <Link key={item?.id} href={`/resources/detail/${item?.id}`}>
                            <BookCardHoverGradient
                                key={item?.id}
                                title={item.name_kh ? item.name_kh : item.name}
                                subTitle={item.name_kh ? item.name : ''}
                                image_url={`/assets/images/items/thumb/${item.thumbnail}`}
                            />
                        </Link>
                    ))}
                    <div className="relative z-10 flex h-full min-h-40 w-full items-center justify-center overflow-hidden rounded-md border-2 border-background pl-6 shadow dark:border-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                        <Link href={`/resources/${mainCategory?.code}?category_code=${showData?.category?.code || ''}`} prefetch>
                            <HoverButton />
                        </Link>
                    </div>
                </div>
            ) : (
                <NoDataDisplay />
            )}
        </div>
    );
}
