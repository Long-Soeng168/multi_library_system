import { MotionHighlight } from '@/components/animate-ui/effects/motion-highlight';
import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import SmallOverlayTopRightButton from '../Button/SmallOverlayTopRightButton';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import TableCellAvatar from '../Avatar/TableCellAvatar';

export const Feature3 = ({ data, showLimit = 10 }: { data: any; showLimit?: number }) => {
    const { t, currentLocale } = useTranslation();

    const [showAll, setShowAll] = useState(false);
    // show 7 + "See All" card when collapsed
    // const visibleCards = showAll ? libraryTypes : libraryTypes.slice(0, 7);
    const visibleCards = showAll ? data : data.slice(0, showLimit);

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <MotionHighlight hover className="rounded-xl">
                {visibleCards?.map((item: any) => (
                    <Link href={`/resources/${item?.item_main_category_code}?category_code=${item.code}`} key={item.id} prefetch>
                        <div key={item.id} data-id={item.id} className="group relative h-full cursor-pointer">
                            <div className="flex h-full flex-col rounded-xl border p-4 transition-all duration-300 hover:border-primary hover:shadow-md">
                                <TableCellAvatar
                                    className="flex size-10 items-center justify-center rounded-md border-none bg-primary/10"
                                    imageClassName="object-contain p-1"
                                    altTextClassName="text-primary rounded-none bg-primary/5"
                                    image={`/assets/images/item_categories/thumb/${item.image}`}
                                    alt={currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}
                                />
                                <p className="mt-2 text-base font-medium">{currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}</p>

                                {/* Hover icon overlay (top-right with animation) */}
                                <SmallOverlayTopRightButton className="bg-primary/20 text-primary" iconSize={5} />
                            </div>
                        </div>
                    </Link>
                ))}
            </MotionHighlight>
            {data?.length > showLimit && (
                <div className="h-full w-full">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="group flex h-full min-h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300 hover:border-primary hover:bg-muted"
                    >
                        <div className="flex size-10 items-center justify-around rounded-full bg-primary/5 group-hover:bg-primary/10">
                            {showAll ? <ChevronUpIcon className="size-6 text-primary" /> : <ChevronDownIcon className="size-6 text-primary" />}
                        </div>
                        <p className="text-base">{showAll ? 'Show Less' : 'See All'}</p>
                    </button>
                </div>
            )}
        </div>
    );
};
