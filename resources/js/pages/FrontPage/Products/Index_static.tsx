import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link } from '@inertiajs/react';
import { CheckCircle2, CloudCog, CreditCard, Database, LayoutDashboard } from 'lucide-react';

const Index = () => {
    const { t } = useTranslation();

    const products = [
        {
            id: 21,
            title: t('Digital Library Platform'),
            desc: t('A comprehensive platform for managing digital collections, e-books, journals, and multimedia resources.'),
            icon: <LayoutDashboard className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
            color: 'bg-indigo-50 dark:bg-indigo-950/30',
            features: [t('Advanced search and filtering'), t('Multi-format support'), t('User access management')],
        },
        {
            id: 22,
            title: t('Library Operation Management'),
            desc: t('Streamline daily operations with automated workflows and powerful reporting tools.'),
            icon: <Database className="h-8 w-8 text-green-600 dark:text-green-400" />,
            color: 'bg-green-50 dark:bg-green-950/30',
            features: [t('Automated workflows'), t('Inventory tracking'), t('Analytics and reporting')],
        },
        {
            id: 23,
            title: t('Resource Subscription Service'),
            desc: t('Manage subscriptions with flexible pricing models and automated renewals.'),
            icon: <CreditCard className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />,
            color: 'bg-yellow-50 dark:bg-yellow-950/30',
            features: [t('Flexible pricing models'), t('Automated billing'), t('Usage analytics')],
        },
        {
            id: 24,
            title: t('Cloud & On-Premise Deployment'),
            desc: t('Deploy on cloud, on-premise, or hybrid environments based on your needs.'),
            icon: <CloudCog className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
            color: 'bg-blue-50 dark:bg-blue-950/30',
            features: [t('Fully managed cloud hosting'), t('On-premise installation'), t('Hybrid deployment options')],
        },
    ];

    return (
        <FrontPageLayout>
            <main className="mx-auto min-h-svh w-full flex-1 bg-white transition-colors duration-300 dark:bg-gray-950">
                {/* Header */}
                <section className="px-4 pt-12 pb-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">{t('Our Products')}</h1>
                            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                                {t('Comprehensive solutions for modern digital libraries')}
                            </p>
                        </div>

                        {/* Main Products Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {products.map((product) => (
                                <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-gray-700">
                                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${product.color}`}>
                                        {product.icon}
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                        {product.title}
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">{product.desc}</p>
                                    <ul className="space-y-3">
                                        {product.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">{t('Ready to Get Started?')}</h2>
                        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
                            {t('Explore our pricing plans or contact us to learn more about how Banalai can transform your digital library.')}
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="/pricing"
                                className="rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 font-bold text-gray-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                            >
                                {t('View Pricing')}
                            </Link>
                            <Link
                                href="/support"
                                className="rounded-lg border-2 border-indigo-600 bg-white px-8 py-4 font-bold text-indigo-600 transition-all hover:bg-indigo-50 dark:border-indigo-400 dark:bg-transparent dark:text-indigo-400 dark:hover:bg-indigo-950/30"
                            >
                                {t('Get Support')}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </FrontPageLayout>
    );
};

export default Index;
