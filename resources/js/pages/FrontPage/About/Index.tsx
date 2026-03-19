import { ScrollProgress } from '@/components/ui/scroll-progress';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link } from '@inertiajs/react';
import { Accessibility, Lock, ShieldCheck, Star, Users, Zap } from 'lucide-react';

const Index = () => {
    const { t } = useTranslation();

    const values = [
        {
            title: t('Community First'),
            desc: t('We prioritize the needs of libraries and their communities in everything we build.'),
            icon: <Users className="h-6 w-6 text-white" />,
            color: 'bg-purple-500',
        },
        {
            title: t('Quality Excellence'),
            desc: t('We maintain the highest standards in our products, services, and support.'),
            icon: <Star className="h-6 w-6 text-white" />,
            color: 'bg-green-500',
        },
        {
            title: t('Continuous Innovation'),
            desc: t("We're always improving and adding new features based on user feedback."),
            icon: <Zap className="h-6 w-6 text-white" />,
            color: 'bg-yellow-400',
        },
        {
            title: t('Security & Privacy'),
            desc: t("We protect your data and your users' privacy with enterprise-grade security."),
            icon: <Lock className="h-6 w-6 text-white" />,
            color: 'bg-blue-500',
        },
    ];

    const pillars = [
        {
            title: 'Innovation',
            icon: <Zap className="h-6 w-6 text-white" />,
            grad: 'from-indigo-500 to-purple-600',
            text: 'Constantly evolving our technology to meet the changing needs of modern libraries.',
        },
        {
            title: 'Accessibility',
            icon: <Accessibility className="h-6 w-6 text-white" />,
            grad: 'from-green-500 to-emerald-600',
            text: 'Making knowledge accessible to everyone, regardless of location or resources.',
        },
        {
            title: 'Reliability',
            icon: <ShieldCheck className="h-6 w-6 text-white" />,
            grad: 'from-yellow-400 to-orange-500',
            text: 'Providing robust, secure, and dependable solutions you can trust.',
        },
    ];

    return (
        <FrontPageLayout>
            <ScrollProgress className="top-0 h-[4px]" />
            <main className="mx-auto min-h-svh w-full flex-1 bg-white transition-colors duration-300 dark:bg-gray-950">
                {/* Hero Section */}
                <section className="px-4 pt-12 pb-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">{t('About Banalai')}</h1>
                            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                                {t('Empowering libraries and organizations with innovative digital solutions')}
                            </p>
                        </div>

                        <div className="mb-20 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div>
                                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{t('Our Mission')}</h2>
                                <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                                    <p>
                                        {t(
                                            'At Banalai, we believe that knowledge should be accessible to everyone, everywhere. Our mission is to empower libraries, schools, universities, and organizations with flexible, modern digital library solutions that break down barriers to information access.',
                                        )}
                                    </p>
                                    <p>
                                        {t(
                                            'We combine cutting-edge technology with user-friendly design to create platforms that not only store and organize digital resources but also make them easily discoverable and accessible to users around the world.',
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Core Pillars Cards */}
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="space-y-6">
                                    {pillars.map((pillar, i) => (
                                        <div key={i} className="flex items-start">
                                            <div
                                                className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${pillar.grad} shadow-md`}
                                            >
                                                {pillar.icon}
                                            </div>
                                            <div>
                                                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">{t(pillar.title)}</h3>
                                                <p className="text-gray-600 dark:text-gray-400">{t(pillar.text)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <div className="mx-auto mb-20 max-w-7xl rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-indigo-50/30 p-8 sm:p-12 dark:border-gray-800 dark:from-gray-900 dark:to-indigo-950/20">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{t('Our Story')}</h2>
                        <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                            <p>
                                {t(
                                    'Banalai was founded with a simple yet powerful vision: to revolutionize how libraries and educational institutions manage and share digital resources...',
                                )}
                            </p>
                            <p>{t('Today, Banalai serves hundreds of libraries, schools, and organizations worldwide...')}</p>
                            <p>{t('Powered by Alphalib technology, we continue to innovate and expand our capabilities...')}</p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <section className="mb-20 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">{t('Our Values')}</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {values.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-gray-700"
                                >
                                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${v.color}`}>{v.icon}</div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{v.title}</h3>
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-8 text-center text-white shadow-xl sm:p-12 dark:from-indigo-700 dark:via-blue-700 dark:to-purple-700">
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{t('Join Us on Our Mission')}</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-indigo-100">
                            {t(
                                "Whether you're a library looking to modernize your digital services or an organization seeking better resource management, we're here to help.",
                            )}
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="/contact"
                                className="rounded-lg bg-white px-8 py-4 font-semibold text-indigo-600 shadow-lg transition-all hover:scale-105 hover:bg-gray-50"
                            >
                                {t('Get in Touch')}
                            </Link>
                            <Link
                                href="/pricing"
                                className="rounded-lg border-2 border-white bg-transparent px-8 py-4 font-semibold text-white transition-all hover:bg-white/10"
                            >
                                {t('View Pricing')}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </FrontPageLayout>
    );
};

export default Index;
