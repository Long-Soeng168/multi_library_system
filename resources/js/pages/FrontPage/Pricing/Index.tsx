import { ScrollProgress } from '@/components/ui/scroll-progress';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Index = () => {
    const { t } = useTranslation();

    const plans = [
        {
            name: t('Free Plan'),
            price: '$0',
            duration: t('Forever free'),
            features: [
                { text: t('Limited digital library features'), active: true },
                { text: t('Up to 1,000 resources'), active: true },
                { text: t('Community support'), active: true },
                { text: t('Standard templates'), active: true },
                { text: 'Bookcambo integrated', active: true, link: 'https://www.bookcambo.com' },
            ],
            cta: t('Get Started'),
            href: '/banalai_register',
            popular: false,
        },
        {
            name: t('Cloud Subscription'),
            price: '$299',
            duration: t('/year'),
            features: [
                { text: t('Full digital library features'), active: true },
                { text: t('Unlimited resources'), active: true },
                { text: t('Catalog, Classification & Circulation'), active: true },
                { text: t('Full Report & Analytics'), active: true },
                { text: t('Cloud hosting included'), active: true },
                { text: t('Automatic updates'), active: true },
                { text: t('Priority support'), active: true },
                { text: t('Custom Domain support'), active: true },
                { text: 'Bookcambo integrated', active: true, link: 'https://www.bookcambo.com' },
            ],
            cta: t('Get Started'),
            href: '/banalai_register',
            popular: true,
        },
        {
            name: t('Local Server License'),
            price: '',
            duration: t('Price to be discussed'),
            features: [
                { text: t('Full digital library features'), active: true },
                { text: t('Unlimited resources'), active: true },
                { text: t('On-premise installation'), active: true },
                { text: t('Setup & training included'), active: true },
                { text: t('1 year support included'), active: true },
                { text: 'Bookcambo integrated', active: true, link: 'https://www.bookcambo.com' },
                { text: t('Optional extended support'), active: false },
            ],
            cta: t('Contact for Pricing'),
            href: '/support',
            popular: false,
        },
    ];

    return (
        <FrontPageLayout>
            <ScrollProgress className="top-0 h-[4px]" />
            <section className="bg-gradient-to-b from-slate-50 to-white px-4 pt-12 pb-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-950">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">{t('Pricing Plans')}</h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                            {t('Choose the plan that works best for your organization')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative flex flex-col h-full rounded-2xl border p-8 transition-all duration-300 ${
                                    plan.popular
                                        ? 'z-10 scale-105 border-indigo-600 bg-white shadow-2xl dark:bg-gray-900 dark:shadow-indigo-500/10'
                                        : 'border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900/50'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-bold tracking-wider text-white uppercase">
                                        {t('Most Popular')}
                                    </div>
                                )}

                                <div className="mb-8 text-center">
                                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                                        <span className="font-medium text-gray-500 dark:text-gray-400">{plan.duration}</span>
                                    </div>
                                </div>

                                <ul className="mb-8 flex-1 space-y-4">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3">
                                            {feature.active ? (
                                                <CheckCircle2
                                                    className={`h-5 w-5 flex-shrink-0 ${plan.popular ? 'text-indigo-500' : 'text-green-500'}`}
                                                />
                                            ) : (
                                                <XCircle className="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600" />
                                            )}
                                            <span
                                                className={`text-sm ${feature.active ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}
                                            >
                                                {feature.link ? (
                                                    <a href={feature.link} target="_blank" className="font-semibold text-indigo-600 hover:underline">
                                                        {feature.text}
                                                    </a>
                                                ) : (
                                                    feature.text
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.href}
                                    className={`block w-full rounded-xl py-4 text-center font-bold transition-all ${
                                        plan.popular
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Image Section */}
            <div className="mx-auto max-w-7xl py-20">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Plan Comparison')}</h2>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="p-5 text-sm font-bold tracking-wider text-gray-900 uppercase dark:text-white">{t('Features')}</th>
                                    <th className="p-5 text-center text-sm font-bold text-gray-900 dark:text-white">{t('Free')}</th>
                                    <th className="p-5 text-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        {t('Cloud Subscription')}
                                    </th>
                                    <th className="p-5 text-center text-sm font-bold text-gray-900 dark:text-white">{t('Local Server')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {/* Digital Library Access */}
                                <tr>
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Digital Library Access')}</td>
                                    <td className="p-5 text-center text-gray-500 dark:text-gray-400">{t('Limited')}</td>
                                    <td className="p-5 text-center font-bold text-indigo-600 dark:text-indigo-400">✓ {t('Full')}</td>
                                    <td className="p-5 text-center text-gray-700 dark:text-gray-300">✓ {t('Full')}</td>
                                </tr>
                                {/* Resource Limit */}
                                <tr className="bg-gray-50/30 dark:bg-gray-800/20">
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Resource Limit')}</td>
                                    <td className="p-5 text-center text-gray-500 dark:text-gray-400">1,000</td>
                                    <td className="p-5 text-center font-bold text-indigo-600 dark:text-indigo-400">{t('Unlimited')}</td>
                                    <td className="p-5 text-center text-gray-700 dark:text-gray-300">{t('Unlimited')}</td>
                                </tr>
                                {/* Hosting */}
                                <tr>
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Hosting')}</td>
                                    <td className="p-5 text-center text-gray-500 dark:text-gray-400">{t('Cloud')}</td>
                                    <td className="p-5 text-center font-bold text-indigo-600 dark:text-indigo-400">{t('Cloud (Included)')}</td>
                                    <td className="p-5 text-center text-gray-700 dark:text-gray-300">{t('On-Premise')}</td>
                                </tr>
                                {/* Automatic Updates */}
                                <tr className="bg-gray-50/30 dark:bg-gray-800/20">
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Automatic Updates')}</td>
                                    <td className="p-5 text-center text-green-500">✓</td>
                                    <td className="p-5 text-center text-indigo-600 dark:text-indigo-400">✓</td>
                                    <td className="p-5 text-center text-gray-500 dark:text-gray-400">{t('Manual')}</td>
                                </tr>
                                {/* Support */}
                                <tr>
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Support')}</td>
                                    <td className="p-5 text-center text-gray-500 dark:text-gray-400">{t('Community')}</td>
                                    <td className="p-5 text-center font-bold text-indigo-600 dark:text-indigo-400">{t('Priority')}</td>
                                    <td className="p-5 text-center text-gray-700 dark:text-gray-300">{t('1 Year Included')}</td>
                                </tr>
                                {/* Advanced Analytics */}
                                <tr className="bg-gray-50/30 dark:bg-gray-800/20">
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Advanced Analytics')}</td>
                                    <td className="p-5 text-center text-gray-300 dark:text-gray-700">—</td>
                                    <td className="p-5 text-center text-indigo-600 dark:text-indigo-400">✓</td>
                                    <td className="p-5 text-center text-gray-700 dark:text-gray-300">✓</td>
                                </tr>
                                {/* Custom Branding */}
                                <tr>
                                    <td className="p-5 font-medium text-gray-700 dark:text-gray-300">{t('Custom Branding')}</td>
                                    <td className="p-5 text-center text-gray-300 dark:text-gray-700">—</td>
                                    <td className="p-5 text-center text-indigo-600 dark:text-indigo-400">✓</td>
                                    <td className="p-5 text-center text-gray-700 dark:text-gray-300">✓</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </FrontPageLayout>
    );
};

export default Index;
