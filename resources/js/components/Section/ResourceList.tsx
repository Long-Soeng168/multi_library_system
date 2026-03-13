import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import BookCardHoverGradient from '../Card/BookCardHoverGradient';
import NoDataDisplay from '../NoDataDisplay';
import PaginationTabs from '../Pagination/PaginationTabs';

const ResourceList = ({ className }: { className?: string }) => {
    const { mainCategory, tableData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <>
            {tableData?.total == 0 && (
                <div className="w-full pt-10">
                    <NoDataDisplay />
                </div>
            )}
            <div className={cn(`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4`, className)}>
                {tableData?.data?.map((item: any) => (
                    <Link href={`/resources/detail/${item?.id}`}>
                        <BookCardHoverGradient
                            key={item?.id}
                            title={item.name_kh ? item.name_kh : item.name}
                            subTitle={item.name_kh ? item.name : ''}
                            image_url={`/assets/images/items/thumb/${item.thumbnail}`}
                        />
                    </Link>
                ))}
            </div>
            <PaginationTabs perPageList={[16, 32, 64, 128, 256]} containerClassName="mx-0 px-0" buttonClassName="rounded-sm" />
        </>
    );
};

export default ResourceList;
