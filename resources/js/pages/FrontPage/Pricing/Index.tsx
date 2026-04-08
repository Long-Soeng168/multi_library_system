import { ScrollProgress } from '@/components/ui/scroll-progress';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link, usePage } from '@inertiajs/react';

const Index = () => {
    const { t, currentLocale } = useTranslation();

    const { tableData, pricingPlans } = usePage<any>().props;

    return (
        <FrontPageLayout>
            <ScrollProgress className="top-0 h-[4px]" />
            <section className="bg-gradient-to-b from-slate-50 to-white px-4 pt-12 pb-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-950">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                            {currentLocale === 'kh' ? pricingPlans?.name_kh || pricingPlans?.name : pricingPlans?.name}
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
                            {currentLocale === 'kh'
                                ? pricingPlans?.short_description_kh || pricingPlans?.short_description
                                : pricingPlans?.short_description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
                        {tableData.map((plan: any) => (
                            <div
                                key={plan.id}
                                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 ${
                                    plan.is_popular // Updated from plan.popular
                                        ? 'z-10 scale-105 border-indigo-600 bg-white shadow-2xl dark:bg-gray-900 dark:shadow-indigo-500/10'
                                        : 'border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900/50'
                                }`}
                            >
                                {plan.is_popular === 1 && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-bold tracking-wider text-white uppercase">
                                        {t('Popular')}
                                    </div>
                                )}

                                <div className="mb-8 text-center">
                                    <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {/* Fallback to Khmer name if it exists and your locale is KH */}
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                            {plan.price == 0 ? '' : `$${Number(plan.price).toFixed(0)}`}
                                        </span>
                                        <span className="font-medium text-gray-500 dark:text-gray-400">{plan.billing_cycle_label}</span>
                                    </div>
                                </div>

                                <div
                                    className="prose h-full max-w-none dark:prose-invert prose-ul:pl-0 prose-li:pl-0"
                                    dangerouslySetInnerHTML={{
                                        __html: currentLocale === 'kh' ? plan?.long_description_kh || plan?.long_description : plan?.long_description,
                                    }}
                                />

                                <Link
                                    href={plan.action_url}
                                    className={`mt-6 block w-full rounded-xl py-4 text-center font-bold transition-all ${
                                        plan.is_popular == 1
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {plan.button_label}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Image Section */}
            <div
                dangerouslySetInnerHTML={{
                    __html:
                        currentLocale === 'kh' ? pricingPlans?.long_description_kh || pricingPlans?.long_description : pricingPlans?.long_description,
                }}
            ></div>
        </FrontPageLayout>
    );
};

export default Index;
