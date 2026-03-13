import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/animate-ui/radix/accordion';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { Accordion } from '../ui/accordion';
import { Badge } from '../ui/badge';

const LibraryInfo = () => {
    const { showData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const renderField = (label: string, value: any) => {
        if (!value) return null;
        return (
            <div className="flex items-baseline gap-2">
                <strong className="shrink-0">{t(label)}:</strong> {value}
            </div>
        );
    };

    return (
        <>
            {/* General Information */}
            <Accordion type="single" defaultValue="general-info" collapsible className="mx-auto w-full max-w-full shadow-none">
                <AccordionItem value="general-info" className="border-none shadow-none">
                    <AccordionTrigger className="text-lg font-semibold">{t('General Information')}</AccordionTrigger>
                    <AccordionContent className="rounded border p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                {renderField('Affiliated Institution', showData.affiliated_institution)}
                                {showData.library_type && (
                                    <div className="flex items-baseline gap-2">
                                        <strong className="shrink-0">{t('Library Type')}:</strong>{' '}
                                        {currentLocale === 'kh'
                                            ? showData?.library_type?.name_kh || showData?.library_type?.name
                                            : showData?.library_type?.name}
                                    </div>
                                )}

                                {renderField('Facebook', showData.facebook_name)}
                                {renderField('Website', showData.website)}
                                {renderField('Phone', showData.phone)}
                                {renderField('Email', showData.email)}
                                {showData.province && (
                                    <div className="flex items-baseline gap-2">
                                        <strong className="shrink-0">{t('Province')}:</strong>{' '}
                                        {currentLocale === 'kh' ? showData?.province?.name_kh || showData?.province?.name : showData?.province?.name}
                                    </div>
                                )}
                                {renderField('Address', showData.address)}
                            </div>
                            <div className="space-y-2">
                                {showData.funding_type && (
                                    <div className="flex items-baseline gap-2">
                                        <strong className="shrink-0">{t('Source of Funding')}:</strong>{' '}
                                        {currentLocale === 'kh'
                                            ? showData?.funding_type?.name_kh || showData?.funding_type?.name
                                            : showData?.funding_type?.name}
                                    </div>
                                )}

                                {showData.class_type && (
                                    <div className="flex items-baseline gap-2">
                                        <strong className="shrink-0">{t('Library Class')}:</strong>{' '}
                                        {currentLocale === 'kh'
                                            ? showData?.class_type?.name_kh || showData?.class_type?.name
                                            : showData?.class_type?.name}
                                    </div>
                                )}

                                {showData.target_users?.length > 0 && (
                                    <div className="flex items-baseline gap-2">
                                        <strong className="shrink-0">{t('Target Users')}:</strong>{' '}
                                        <div className="flex flex-wrap gap-1">
                                            {showData.target_users?.map((item: any) => (
                                                <Badge className="rounded" variant="outline">
                                                    {item.type?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {showData.age_of_target_users?.length > 0 && (
                                    <div className="flex items-baseline gap-2">
                                        <strong className="shrink-0">{t('Age of Target Users')}:</strong>{' '}
                                        <div className="flex flex-wrap gap-1">
                                            {showData.age_of_target_users?.map((item: any) => (
                                                <Badge className="rounded" variant="outline">
                                                    {item.type?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {renderField('Memberships', showData.memberships)}
                                {renderField('Partnerships', showData.partnerships)}
                                {renderField('Programs', showData.programs_and_projects)}
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    );
};

export default LibraryInfo;
