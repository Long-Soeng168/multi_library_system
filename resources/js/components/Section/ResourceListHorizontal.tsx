import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import NoDataDisplay from '../NoDataDisplay';
import PaginationTabs from '../Pagination/PaginationTabs';

const ResourceListHorizontal = ({ className }: { className?: string }) => {
    const { tableData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <>
            {tableData?.total === 0 && (
                <div className="w-full pt-10">
                    <NoDataDisplay />
                </div>
            )}

            <div className={cn('flex flex-col', className)}>
                {tableData?.data?.map((item: any) => {
                    const title = currentLocale === 'kh' ? item.name_kh || item.name : item.name;
                    const subTitle = currentLocale === 'kh' && item.name_kh ? item.name : '';
                    const description = currentLocale === 'kh' ? item.long_description_kh || item.long_description : item.long_description;
                    const image_url = `/assets/images/items/thumb/${item.thumbnail}`;

                    return (
                        <Link
                            href={`/resources/detail/${item?.id}`}
                            key={item.id}
                            className="group flex flex-row gap-4 border-b bg-background p-4 transition-all duration-300 hover:bg-slate-50/50 hover:shadow-md sm:flex-row sm:gap-6 sm:p-6 md:hover:-translate-y-1 dark:border-slate-800 dark:hover:bg-slate-900/60 dark:hover:shadow-black/30"
                        >
                            {/* Left: Thumbnail with Compact Avatar Design */}
                            <div className="aspect-[3/4] h-[170.6px] w-32 shrink-0 overflow-hidden rounded">
                                <Avatar className="h-full w-full rounded-none border-none">
                                    <AvatarImage
                                        src={image_url}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={title}
                                    />
                                    <AvatarFallback className="relative flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-none bg-muted p-3 text-left">
                                        <div className="z-10 flex w-full flex-col gap-1 border-l-2 border-primary pl-2">
                                            <span className="text-[7px] leading-none font-bold tracking-[0.2em] text-muted-foreground uppercase">
                                                Available at
                                            </span>
                                            <span className="line-clamp-1 font-serif text-[9px] leading-tight tracking-wide text-foreground italic">
                                                {item.library?.name}
                                            </span>
                                        </div>
                                        <div className="z-10 w-full">
                                            <h3 className="line-clamp-4 text-xs leading-[1.1] font-black tracking-tight text-foreground uppercase">
                                                {title}
                                            </h3>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="h-[1px] flex-1 bg-border/60" />
                                            </div>
                                        </div>
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Right: Content Details */}
                            <div className="min-w-0 flex-1">
                                <p className="block">
                                    <p className="line-clamp-2 text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                                        {title}
                                    </p>
                                </p>

                                <div className="mt-2 space-y-1.5 text-xs sm:text-sm">
                                    {/* Author / Researcher Logic */}
                                    {(item.authors?.length > 0 || item.author_name) && (
                                        <div className="flex items-start gap-2">
                                            <span className="shrink-0 text-muted-foreground">{t('By')}:</span>
                                            <div className="flex flex-wrap items-center font-medium">
                                                {item.authors?.length > 0 ? (
                                                    item.authors.map((author: any, idx: number) => (
                                                        <span key={author.id}>
                                                            <span className="line-clamp-1">
                                                                {currentLocale === 'kh' ? author.name_kh || author.name : author.name}
                                                            </span>
                                                            {idx < item.authors.length - 1 && <span className="mx-1 text-muted-foreground">•</span>}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span>{item.author_name}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Category & Metadata */}
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            {item.language?.name && (
                                                <>
                                                    <span className="font-medium text-foreground">
                                                        {currentLocale === 'kh' ? item.language.name_kh || item.language.name : item.language.name}
                                                    </span>
                                                    <span className="h-3 w-[1px] bg-border" />
                                                </>
                                            )}
                                            {(item.publisher?.name || item.published_year) && (
                                                <p className="line-clamp-2">
                                                    <span>
                                                        <span>{t('Published')}: </span>
                                                        <span className="font-medium text-foreground">{item.publisher?.name}</span>
                                                    </span>
                                                    {item.published_year && (
                                                        <span className="font-medium text-foreground"> - {item.published_year}</span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {item?.library?.id && (
                                        <Link
                                            href={`/libraries/${item?.library?.id}`}
                                            className="group/library inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 transition-all hover:border-primary/30 hover:bg-muted"
                                        >
                                            <div className="flex items-center gap-2 text-[13px] leading-none">
                                                <span className="text-muted-foreground/80">{t('Posted by')}</span>

                                                {/* Minimal Separator Dot */}
                                                <span className="h-1 w-1 rounded-full bg-border transition-colors group-hover/library:bg-primary/40" />

                                                <span className="font-semibold text-foreground transition-colors group-hover/library:text-primary group-hover/library:underline">
                                                    {currentLocale === 'kh' ? item.library.name_kh || item.library.name : item.library.name}
                                                </span>

                                                {/* Arrow that appears on hover */}
                                                <ExternalLink
                                                    size={12}
                                                    className="-translate-x-1 text-muted-foreground/40 opacity-0 transition-all group-hover/library:translate-x-0 group-hover/library:opacity-100"
                                                />
                                            </div>
                                        </Link>
                                    )}
                                </div>

                                {/* Short Description */}
                                {description && (
                                    <p
                                        className="prose mt-3 line-clamp-3 max-w-none text-sm text-muted-foreground italic"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    ></p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <PaginationTabs perPageList={[16, 32, 64, 128, 256]} containerClassName="mx-0 px-0" buttonClassName="rounded-sm" />
        </>
    );
};

export default ResourceListHorizontal;
