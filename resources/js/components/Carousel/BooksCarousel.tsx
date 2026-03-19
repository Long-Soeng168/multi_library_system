import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import HoverButton from '../Button/HoverButton';
import BookCardHoverGradient from '../Card/BookCardHoverGradient';
import { PlaceholderPattern } from '../ui/placeholder-pattern';

const BooksCarousel = ({ items, mainCategoryCode }: { items: any[]; mainCategoryCode: string }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="overflow-hidden">
            <Carousel setApi={setApi} opts={{ align: 'start' }} className="w-full overflow-hidden pb-4">
                <CarouselContent className="-ml-1 p-2 pr-1.5">
                    {items?.map((item) => (
                        <CarouselItem key={item.id} className="pl-1 md:basis-1/2 lg:basis-1/5">
                            <div className="h-full p-1">
                                <Link href={`/resources/detail/${item.id}`}>
                                    <BookCardHoverGradient
                                        library_name={item?.library?.name}
                                        title={item.name_kh ?? item.name}
                                        subTitle={item.name_kh ? item.name : ''}
                                        image_url={`/assets/images/items/thumb/${item.thumbnail}`}
                                    />
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}

                    {/* View more */}
                    <CarouselItem key="SeeMore" className="px-2 py-1 md:basis-1/2 lg:basis-1/5">
                        <div className="relative flex h-full items-center justify-center rounded-md border border-transparent p-1 shadow dark:border-white/20">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                            <Link href={`/resources/${mainCategoryCode}`} prefetch>
                                <HoverButton />
                            </Link>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                {/* Navigation */}
                <div className="mt-2 flex items-center justify-between pr-2 pl-3">
                    {/* Dots */}
                    <div className="mr-4 flex items-center justify-center gap-2">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={cn(
                                    'size-4 cursor-pointer rounded-full border-2 transition-colors',
                                    current === index ? 'border-primary bg-primary' : 'border-neutral-300',
                                )}
                            />
                        ))}
                    </div>

                    <div className="space-x-2">
                        <CarouselPrevious className="static top-0 left-4 z-10 h-10 w-10 translate-y-0 transform rounded-md border border-neutral-300 bg-background/50 shadow-none backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-background hover:shadow-lg" />
                        <CarouselNext className="static top-0 right-4 z-10 h-10 w-10 translate-y-0 transform rounded-md border border-neutral-300 bg-background/50 shadow-none backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-background hover:shadow-lg" />
                    </div>
                </div>
            </Carousel>
        </div>
    );
};

export default BooksCarousel;
