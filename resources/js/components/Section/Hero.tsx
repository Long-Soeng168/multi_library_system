import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import LibrarySearch from '../Search/LibrarySearch';

const Hero = () => {
    const { mainCategories } = usePage<any>().props;
    const { t } = useTranslation();

    return (
        <section className="relative flex flex-col overflow-x-hidden bg-background py-16 text-foreground transition-colors duration-300 dark:bg-gray-950">
            <div className="section-container ">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <h1 className="mb-6 text-3xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
                            {t('Access Knowledge')}
                            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {t('Without Limits')}
                            </div>
                        </h1>

                        <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-400">
                            {t(
                                'Discover thousands of digital resources from expert libraries. Start your learning journey today and unlock your potential with flexible digital library solutions.',
                            )}
                        </p>

                        <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/banalai_register"
                                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-center font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                            >
                                {t('Get Started')}
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full rounded-lg border border-gray-300 bg-white px-8 py-4 text-center font-semibold text-gray-700 shadow-md transition-all hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                {t('Demo')}
                            </Link>
                        </div>
                    </div>

                    {/* Image / Visual Content */}
                    <div className="order-1 lg:order-2">
                        <div className="relative">
                            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-2xl dark:border-gray-800">
                                <img
                                    alt={t('People collaborating with digital library resources')}
                                    className="h-auto w-full object-cover"
                                    src="/assets/images/pages/1768289705_image.webp"
                                />
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute -right-8 -bottom-8 -z-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl dark:bg-indigo-500/10"></div>
                            <div className="absolute -top-8 -left-8 -z-10 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl dark:bg-purple-500/10"></div>
                        </div>
                    </div>
                </div>
                {/* Optional: Integrate LibrarySearch if needed here */}
                <div className="max-w-full mt-10">
                    <LibrarySearch />
                </div>
            </div>
        </section>
    );
};

export default Hero;
