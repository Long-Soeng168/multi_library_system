import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { MotionHighlight } from '../animate-ui/effects/motion-highlight';
import SmallOverlayTopRightButton from '../Button/SmallOverlayTopRightButton';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export default function ResourceMainCategory() {
    const { mainCategories } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    if (mainCategories?.length <= 1) return null;

    return (
        <ScrollArea className="h-full w-full overflow-x-auto pb-8">
            {/* Actual Max width padding-x and 5 cols items = 1280 - (16*2) -  (16*4) = 1184px (236.8px each)*/}
            <div className="section-container grid grid-cols-3 gap-2 px-4 md:gap-4">
                <MotionHighlight hover className="rounded-md">
                    {mainCategories.map((item: any) => (
                        <Link key={item?.id} prefetch href={`/resources/${item?.code}`}>
                            <div
                                data-value={item?.id}
                                className="h-full"

                                // For 5 Items and change container to 'Flex'
                                // className="group relative h-full w-[125px] flex-shrink-0 cursor-pointer overflow-hidden sm:w-[160px] md:w-[200px] lg:w-[236.8px]"
                            >
                                <div className="flex h-full flex-col items-center justify-center rounded-md border pt-3 transition-all duration-300 hover:border-primary hover:shadow-md">
                                    <div className="mb-2 flex size-8 items-center justify-center rounded md:size-12 md:rounded-lg">
                                        <img src={`/assets/images/item_categories/thumb/${item?.image}`} alt="" />
                                    </div>
                                    <p className="mb-2 text-center text-xs leading-none font-medium md:text-lg">
                                        {currentLocale == 'kh' ? (item?.name_kh ?? item?.name) : item?.name}
                                    </p>

                                    {/* Hover icon overlay */}
                                    <SmallOverlayTopRightButton className="bg-primary/20 text-primary max-md:hidden" iconSize={5} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </MotionHighlight>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
