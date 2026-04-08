import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { usePage } from '@inertiajs/react';

const Index = () => {
    const { t, currentLocale } = useTranslation();
    const { showData } = usePage<any>().props;

    return (
        <FrontPageLayout>
            <div
                dangerouslySetInnerHTML={{
                    __html: currentLocale === 'kh' ? showData?.long_description_kh || showData?.long_description : showData?.long_description,
                }}
            ></div>
        </FrontPageLayout>
    );
};

export default Index;
