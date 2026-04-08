import { ScrollProgress } from '@/components/ui/scroll-progress';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { usePage } from '@inertiajs/react';

const Index = () => {
    const { t, currentLocale } = useTranslation();
    const { showData } = usePage<any>().props;

    return (
        <FrontPageLayout>
            <main className="mx-auto min-h-svh w-full flex-1 bg-white transition-colors duration-300 dark:bg-gray-950">
                <div
                    dangerouslySetInnerHTML={{
                        __html: currentLocale === 'kh' ? showData?.long_description_kh || showData?.long_description : showData?.long_description,
                    }}
                ></div>
            </main>
        </FrontPageLayout>
    );
};

export default Index;
