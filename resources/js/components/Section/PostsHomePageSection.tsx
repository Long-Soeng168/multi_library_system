import { PostCard } from '@/components/Card/PostCard';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useTranslation from '@/hooks/use-translation';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import HoverButton from '../Button/HoverButton';
import { ContentHeader } from '../Header/ContentHeader';
import { PlaceholderPattern } from '../ui/placeholder-pattern';

const PostsHomePageSection = () => {
    const { posts } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

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

    if (posts?.length < 1) return null;

    return (
        <div className="mt-4">
            <div className="section-container">
                <ContentHeader link="/posts" title={t('Latest Posts')} />
            </div>

            {/* Post List */}
            <div className="section-container">
                <Carousel setApi={setApi} opts={{ align: 'start' }} className="w-full">
                    <CarouselContent className="ml-0">
                        {posts?.map((post: any) => (
                            <CarouselItem key={post.id} className="gap-0 overflow-hidden px-0 md:basis-1/2 lg:basis-1/3">
                                <PostCard
                                    url={`/posts/${post.id}`}
                                    title={currentLocale === 'kh' ? (post.title_kh ?? post.title) : post.title}
                                    categoryName={currentLocale == 'kh' ? (post.category?.name_kh ?? post.category?.name) : post.category?.name}
                                    description={
                                        currentLocale === 'kh' ? (post.short_description_kh ?? post.short_description) : post.short_description
                                    }
                                    date={formatToKhmerDateTime(post.created_at, false)}
                                    thumbnail={`/assets/images/posts/thumb/${post.thumbnail}`}
                                />
                            </CarouselItem>
                        ))}

                        {/* See more */}
                        <CarouselItem key="SeeMore" className="gap-0 overflow-hidden border-b px-0 md:basis-1/2 lg:basis-1/4">
                            <div className="relative flex h-full items-center justify-center border-t border-r">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/5" />
                                <Link href="/posts" prefetch>
                                    <HoverButton />
                                </Link>
                            </div>
                        </CarouselItem>
                    </CarouselContent>

                    {/* Navigation */}
                    <div className="mt-2 flex items-center justify-between">
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

                        {/* Arrows */}
                        <div className="space-x-2">
                            <CarouselPrevious className="static top-0 left-4 z-10 h-10 w-10 translate-y-0 transform rounded-none border border-neutral-300 bg-background/50 shadow-none backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-background hover:shadow-lg" />
                            <CarouselNext className="static top-0 right-4 z-10 h-10 w-10 translate-y-0 transform rounded-none border border-neutral-300 bg-background/50 shadow-none backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-background hover:shadow-lg" />
                        </div>
                    </div>
                </Carousel>
            </div>
        </div>
    );
};

export default PostsHomePageSection;
