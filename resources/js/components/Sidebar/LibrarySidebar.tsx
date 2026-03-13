import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/animate-ui/radix/accordion';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';
import LibrarySidebarList from './LibrarySidebarList';

export default function LibrarySidebar() {
    const { libraryTypes, fundingTypes, classTypes, provincesData } = usePage<any>().props;

    const { t, currentLocale } = useTranslation();

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const [filters, setFilters] = useState({
        library_type_code: initialQueryParams.get('library_type_code') || '',
        source_of_funding_type_code: initialQueryParams.get('source_of_funding_type_code') || '',
        class_type_code: initialQueryParams.get('class_type_code') || '',
        annual_budget_type_code: initialQueryParams.get('annual_budget_type_code') || '',
        library_system_type_code: initialQueryParams.get('library_system_type_code') || '',
        province_code: initialQueryParams.get('province_code') || '',
        target_user_type_code: initialQueryParams.get('target_user_type_code') || '',
        target_age_user_type_code: initialQueryParams.get('target_age_user_type_code') || '',
    });

    const updateFilters = (updates: Partial<typeof filters>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        applyFilter(newFilters);
    };

    const applyFilter = (appliedFilters?: typeof filters) => {
        if (!currentPath) return;
        const f = appliedFilters ?? filters;
        const queryParams = new URLSearchParams(window.location.search);

        Object.entries(f).forEach(([key, value]) => {
            if (value) {
                queryParams.set(key, value);
            } else {
                queryParams.delete(key);
            }
        });

        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () =>
        updateFilters({
            library_type_code: '',
            source_of_funding_type_code: '',
            class_type_code: '',
            annual_budget_type_code: '',
            library_system_type_code: '',
            province_code: '',
            target_user_type_code: '',
            target_age_user_type_code: '',
        });

    return (
        <>
            <Accordion
                type="multiple"
                defaultValue={['funding', 'types', 'classes', 'provinces']}
                className={cn(
                    'w-full rounded-lg border px-4',
                    Object.values(filters).some((val) => !!val) && 'border-primary ring-4 ring-primary/20',
                )}
            >
                <AccordionItem value="funding" key="funding">
                    <AccordionTrigger className="pb-2 font-semibold">{t('Funding Source')}</AccordionTrigger>
                    <AccordionContent>
                        <LibrarySidebarList
                            heading={t('All Funding Source')}
                            value={filters.source_of_funding_type_code}
                            key={filters.source_of_funding_type_code}
                            onChange={(val) => updateFilters({ source_of_funding_type_code: val })}
                            options={fundingTypes.map((item: any) => ({
                                value: item.code,
                                label: currentLocale === 'kh' ? item.name_kh || item.name : item.name,
                            }))}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="types" key="types">
                    <AccordionTrigger className="font-semibold">{t('Type of Library')}</AccordionTrigger>
                    <AccordionContent>
                        <LibrarySidebarList
                            heading={t('All Type of Library')}
                            value={filters.library_type_code}
                            key={filters.library_type_code}
                            onChange={(val) => updateFilters({ library_type_code: val })}
                            options={libraryTypes.map((item: any) => ({
                                value: item.code,
                                label: currentLocale === 'kh' ? item.name_kh || item.name : item.name,
                            }))}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="classes" key="classes">
                    <AccordionTrigger className="font-semibold">{t('Library Classes')}</AccordionTrigger>
                    <AccordionContent>
                        <LibrarySidebarList
                            heading={t('All Library Classes')}
                            value={filters.class_type_code}
                            key={filters.class_type_code}
                            onChange={(val) => updateFilters({ class_type_code: val })}
                            options={classTypes.map((item: any) => ({
                                value: item.code,
                                label: currentLocale === 'kh' ? item.name_kh || item.name : item.name,
                            }))}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="provinces" key="provinces" className="border-none">
                    <AccordionTrigger className="font-semibold">{t('Provinces')}</AccordionTrigger>
                    <AccordionContent>
                        <LibrarySidebarList
                            heading={t('All Provinces')}
                            value={filters.province_code}
                            key={filters.province_code}
                            onChange={(val) => updateFilters({ province_code: val })}
                            options={provincesData.map((province: any) => ({
                                value: province.code,
                                label: currentLocale === 'kh' ? province.name_kh || province.name : province.name,
                            }))}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <div className="flex justify-end">
                <button onClick={resetFilter} className="mt-2 flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted hover:underline">
                    <RotateCwIcon size={18} /> {t('Clear Filter')}
                </button>
            </div>
        </>
    );
}
