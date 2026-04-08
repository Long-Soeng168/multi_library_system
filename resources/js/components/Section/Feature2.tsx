import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { ContentHeader } from '../Header/ContentHeader';
import { BookScrollAreaHorizontal } from '../ScrollArea/BookScrollAreaHorizontal';

export default function Feature2() {
    const { recentItems } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    return (
        <div className="mt-20">
            <div className="section-container space-y-12 px-0">
                {recentItems?.length > 0 && (
                    <div>
                        <ContentHeader containerClassName="px-3 mb-0" link={`/resources`} title={t('Recent Resources')} />

                        <BookScrollAreaHorizontal items={recentItems} mainCategoryCode={''} />
                    </div>
                )}
            </div>
        </div>
    );
}
