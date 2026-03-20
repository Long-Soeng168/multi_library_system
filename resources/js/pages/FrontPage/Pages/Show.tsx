import { ScrollProgress } from '@/components/ui/scroll-progress';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { usePage } from '@inertiajs/react';

const Show = () => {
    const { showData } = usePage<any>().props;

    return (
        <FrontPageLayout>
            <ScrollProgress className="top-0 h-[4px]" />
            <div className="section-container py-10">
                <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                        __html: showData?.long_description || '',
                    }}
                />
            </div>
        </FrontPageLayout>
    );
};

export default Show;
