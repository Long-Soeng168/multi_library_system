import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';

const HeroFooter = () => {
    const { t, currentLocale } = useTranslation();
    const { get_started_free } = usePage<any>().props;
    if (!get_started_free?.id) return null;
    return (
        <div
            dangerouslySetInnerHTML={{
                __html:
                    currentLocale === 'kh'
                        ? get_started_free?.long_description_kh || get_started_free?.long_description
                        : get_started_free?.long_description,
            }}
        ></div>
    );
};

export default HeroFooter;
