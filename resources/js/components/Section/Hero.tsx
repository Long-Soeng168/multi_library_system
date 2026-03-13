import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import LibrarySearch from '../Search/LibrarySearch';
import { Button } from '../ui/button';

const Hero = () => {
    const { mainCategories } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    return (
        <section className="relative flex flex-col overflow-x-hidden bg-background py-10 text-foreground">
            <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                <div className="mx-auto max-w-5xl">
                    {/* <Link href={`/about`} prefetch>
                        <AnimatedGradientTextBadge />
                    </Link> */}
                    <h1 className="mt-4 mb-5 max-w-full px-1 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                        {/* {currentLocale === 'kh' ? homepageHero?.name_kh || homepageHero?.name : homepageHero?.name} */}
                        {currentLocale === 'kh' ? (
                            <p>
                                <span className="whitespace-nowrap">ធនធានបណ្ណាល័យទាំងអស់ </span>
                                <span className="whitespace-nowrap">នៅទីនេះ</span>
                            </p>
                        ) : (
                            <p>All&nbsp;Library&nbsp;Resources.&nbsp;</p>
                        )}
                    </h1>

                    {/* Search bar */}
                    <LibrarySearch />

                    {/* Suggestion pills */}
                    <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3 gap-y-3">
                        {mainCategories?.length > 1 &&
                            mainCategories.map((item: any) => {
                                return (
                                    <Link key={item?.id} href={`/resources/${item?.code}`} prefetch>
                                        <Button
                                            variant="secondary"
                                            className="flex h-10 items-center gap-1 rounded-full border border-primary/50 px-4 ring-primary/20 transition-all duration-300 hover:border-primary hover:ring-4 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                                        >
                                            <div className="size-6 text-primary">
                                                <img
                                                    className="size-full object-contain"
                                                    src={`/assets/images/item_categories/thumb/${item?.image}`}
                                                    alt=""
                                                />
                                            </div>
                                            <p className="text-base">{currentLocale == 'kh' ? (item?.name_kh ?? item?.name) : item?.name}</p>
                                        </Button>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            </main>
        </section>
    );
};

export default Hero;
