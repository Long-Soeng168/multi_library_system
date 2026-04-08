import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import LibrarySearch from '../Search/LibrarySearch';

const Hero = () => {
    const { t, currentLocale } = useTranslation();
    const { hero } = usePage<any>().props;
    if (!hero?.id) return null;

    return (
        <section className="relative flex flex-col overflow-x-hidden bg-background py-16 text-foreground transition-colors duration-300 dark:bg-gray-950">
            <div className="section-container">
                <div
                    dangerouslySetInnerHTML={{
                        __html: currentLocale === 'kh' ? hero?.long_description_kh || hero?.long_description : hero?.long_description,
                    }}
                ></div>
                {/* Optional: Integrate LibrarySearch if needed here */}
                <div className="mt-10 max-w-full">
                    <LibrarySearch />
                </div>
            </div>
        </section>
    );
};

export default Hero;
