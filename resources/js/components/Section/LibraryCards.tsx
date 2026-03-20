import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';

const LibraryCards = () => {
    const { t, currentLocale } = useTranslation();
    const { libraries } = usePage<any>().props;

    return (
        <section className="bg-background transition-colors duration-300">
            <div className="section-container">
                {/* Header with Shadcn-style muted text and border */}
                <div className="mb-8 flex items-center gap-4">
                    <p className="font-medium text-muted-foreground">{t('Partner libraries')}</p>
                    <div className="h-[1px] flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6">
                    {libraries?.map((library: any) => {
                        const hasExternal = !!library.external_link;
                        const targetLink = library.external_link || `/libraries/${library?.id}`;

                        return (
                            <a
                                key={library.id}
                                href={targetLink}
                                target={hasExternal ? '_blank' : undefined}
                                rel={hasExternal ? 'noopener noreferrer' : undefined}
                                className="group relative flex flex-col items-center justify-center rounded-xl border border-border bg-card px-2 py-4 text-center transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                            >
                                {/* External Link Badge */}
                                {hasExternal && (
                                    <div className="absolute top-3 right-3 z-20 scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                            <ExternalLink size={14} strokeWidth={3} />
                                        </div>
                                    </div>
                                )}

                                {/* Image Container - Increased from h-12/w-12 to h-20/w-20 */}
                                <div className="relative mb-4 flex items-center justify-center overflow-hidden rounded bg-secondary/50 transition-all duration-500 group-hover:bg-secondary dark:bg-secondary/20">
                                    <div className="absolute inset-0 bg-primary opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

                                    <img
                                        className="relative z-10 size-20 bg-white object-contain transition-transform duration-500"
                                        src={`/assets/images/libraries/${library.image}`}
                                        alt={library.name}
                                        onError={(e: any) => {
                                            e.target.src = '/assets/images/default-library.png';
                                        }}
                                    />
                                </div>

                                {/* Text Label - Increased font size to text-xs/sm */}
                                <div className="relative flex flex-col items-center pb-4">
                                    <h3 className="line-clamp-3 text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary sm:text-sm">
                                        {currentLocale === 'kh' ? (library.name_kh ?? library.name) : library.name}
                                    </h3>

                                    {/* Absolute Visit Site text - centered at the bottom */}
                                    {hasExternal && (
                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black whitespace-nowrap text-primary opacity-0 transition-all duration-300 group-hover:bottom-0 group-hover:opacity-70">
                                            {t('Visit Site')}
                                        </span>
                                    )}
                                </div>

                                {/* Modern Background Glow */}
                                <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-all duration-500 group-hover:bg-primary/10" />
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LibraryCards;
