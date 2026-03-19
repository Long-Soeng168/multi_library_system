import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

const HeroFooter = () => {
    const { t } = useTranslation();

    const freeFeatures = [t('Basic digital library access'), t('Limited collection size'), t('Community support'), t('Standard templates')];

    return (
        <section className="bg-gradient-to-br from-blue-50 to-green-50 px-4 py-20 transition-colors duration-300 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-950">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">{t('Start Free, Upgrade When Ready')}</h2>

                <p className="mb-8 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                    {t(
                        "Our Free Digital Library plan offers essential features to get you started. Experience the power of Banalai with limited features, then upgrade seamlessly when you're ready for more advanced capabilities.",
                    )}
                </p>

                <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{t('Free Plan Includes:')}</h3>

                    <ul className="mx-auto max-w-md space-y-4 text-left">
                        {freeFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span className="text-lg">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link
                    href="/bannalai-login"
                    className="inline-block transform rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl hover:brightness-110 active:scale-95"
                >
                    {t('Get Started Free')}
                </Link>
            </div>
        </section>
    );
};

export default HeroFooter;
