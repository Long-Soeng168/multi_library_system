import { ScrollProgress } from '@/components/ui/scroll-progress';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { usePage } from '@inertiajs/react';

const Show = () => {
    const { showData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <FrontPageLayout>
            <ScrollProgress className="top-0 h-[4px]" />
            <div className="section-container py-10">
                <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                        __html: currentLocale === 'kh' ? showData?.long_description_kh || showData?.long_description : showData?.long_description,
                    }}
                />
            </div>
        </FrontPageLayout>
    );
};

export default Show;
