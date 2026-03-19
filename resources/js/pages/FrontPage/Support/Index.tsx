import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, CheckCircle2, Headset, LifeBuoy, Settings } from 'lucide-react';

const Index = () => {
    const { t } = useTranslation();

    const services = [
        {
            href: '/support/42',
            title: t('Technical Support'),
            desc: t('Get expert help when you need it. Our technical support team is available to assist with any issues or questions you may have.'),
            icon: <Headset className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            listColor: 'text-blue-600 dark:text-blue-400',
            features: [t('24/7 email support'), t('Priority support for subscribers'), t('Remote assistance available')],
        },
        {
            href: '/support/43',
            title: t('System Setup & Training'),
            desc: t('Get your team up and running quickly with our comprehensive setup and training services.'),
            icon: <Settings className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />,
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            listColor: 'text-yellow-600 dark:text-yellow-400',
            features: [t('Custom installation assistance'), t('Staff training sessions'), t('Best practices guidance')],
        },
        {
            href: '/support/44',
            title: t('Documentation & Knowledge Base'),
            desc: t('Access comprehensive guides, tutorials, and resources to help you make the most of your digital library.'),
            icon: <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            listColor: 'text-green-600 dark:text-green-400',
            features: [t('Comprehensive user guides'), t('Video tutorials'), t('FAQ and troubleshooting')],
        },
    ];

    return (
        <FrontPageLayout>
            <main className="min-h-svh w-full bg-white transition-colors duration-300 dark:bg-gray-950">
                <section className="px-4 pt-12 pb-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Header */}
                        <div className="mb-16 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">{t('Support & Services')}</h1>
                            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                                {t("We're here to help you succeed with your digital library")}
                            </p>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {services.map((service, idx) => (
                                <Link
                                    key={idx}
                                    href={"#"}
                                    className="group flex flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-md transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-gray-700"
                                >
                                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-lg ${service.bgColor}`}>
                                        {service.icon}
                                    </div>

                                    <h3 className="mb-4 text-2xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                        {service.title}
                                    </h3>

                                    <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">{service.desc}</p>

                                    <ul className="mt-auto space-y-3">
                                        {service.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                                                <CheckCircle2 className={`mr-2 h-5 w-5 flex-shrink-0 ${service.listColor}`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* <div className="mt-8 flex items-center text-sm font-bold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                                        {t('Learn more')} <ArrowRight className="ml-2 h-4 w-4" />
                                    </div> */}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Optional Help Banner */}
                <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-8 md:flex-row dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-blue-600 p-3">
                                <LifeBuoy className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t('Still need help?')}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{t('Our support team is just a message away.')}</p>
                            </div>
                        </div>
                        <Link
                            href="/contact"
                            className="w-full rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-gray-800 md:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                        >
                            {t('Contact Us')}
                        </Link>
                    </div>
                </section>
            </main>
        </FrontPageLayout>
    );
};

export default Index;
