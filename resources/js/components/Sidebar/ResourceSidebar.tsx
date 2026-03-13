import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/animate-ui/radix/accordion';
import LibrarySidebarList from '@/components/Sidebar/LibrarySidebarList';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { RotateCwIcon } from 'lucide-react';
import { useState } from 'react';
import ByYearDialog from '../Dialog/ByYearDialog';

export default function ResourceSidebar() {
    const { categories, authors, publishers, advisors, languages, mainCategory } = usePage<any>().props;

    const { t, currentLocale } = useTranslation();

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const [filters, setFilters] = useState({
        category_code: initialQueryParams.get('category_code') || '',
        grade_code: initialQueryParams.get('grade_code') || '',
        author_id: initialQueryParams.get('author_id') || '',
        publisher_id: initialQueryParams.get('publisher_id') || '',
        advisor_id: initialQueryParams.get('advisor_id') || '',
        language_code: initialQueryParams.get('language_code') || '',
        from_year: initialQueryParams.get('from_year') || '',
        to_year: initialQueryParams.get('to_year') || '',
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

        router.visit(`${currentPath}?${queryParams.toString()}`, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => {
        // 1. Reset local state immediately for UI responsiveness
        setFilters({
            category_code: '',
            grade_code: '',
            author_id: '',
            publisher_id: '',
            advisor_id: '',
            language_code: '',
            from_year: '',
            to_year: '',
        });

        // 2. Visit the current path without any query parameters
        // We set preserveState to false so the component fully reloads with clean props
        router.visit(currentPath, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Accordion
                type="multiple"
                defaultValue={['categories', 'authors', 'publishers', 'advisors', 'languages', 'publishedYears']}
                className={cn(
                    'w-full rounded-lg border px-4',
                    Object.values(filters).some((val) => !!val) && 'border-primary ring-4 ring-primary/20',
                )}
            >
                {categories?.length > 0 && (
                    <AccordionItem value="categories" key="categories">
                        <AccordionTrigger className="font-semibold">
                            {mainCategory?.code == 'theses' ? t('Bachelor') : t('Categories')}
                        </AccordionTrigger>
                        <AccordionContent>
                            <LibrarySidebarList
                                limit={20}
                                heading={t('All Categories')}
                                value={filters.category_code}
                                // key={filters.category_code}
                                onChange={(val) => updateFilters({ category_code: val })}
                                options={categories.map((item: any) => ({
                                    value: item.code,
                                    label: currentLocale === 'kh' ? (item.name_kh ?? item.name) : item.name,
                                    children: item.children,
                                }))}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}

                <AccordionItem value="publishedYears" key="publishedYears">
                    <AccordionTrigger className="font-semibold">{t('Published Year')}</AccordionTrigger>
                    <AccordionContent>
                        <ByYearDialog key={filters.from_year + filters.to_year} />
                    </AccordionContent>
                </AccordionItem>

                {authors?.length > 0 && (
                    <AccordionItem value="authors" key="authors">
                        <AccordionTrigger className="font-semibold">{t('Authors')}</AccordionTrigger>
                        <AccordionContent>
                            <LibrarySidebarList
                                heading={t('All Authors')}
                                value={filters.author_id}
                                key={filters.author_id}
                                onChange={(val) => updateFilters({ author_id: val })}
                                options={authors.map((item: any) => ({
                                    value: item.id,
                                    label: currentLocale === 'kh' ? (item.name_kh ?? item.name) : item.name,
                                    items_count: item.author_items_count,
                                }))}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}

                {publishers?.length > 0 && (
                    <AccordionItem value="publishers" key="publishers">
                        <AccordionTrigger className="font-semibold">{t('Publishers')}</AccordionTrigger>
                        <AccordionContent>
                            <LibrarySidebarList
                                heading={t('All Publishers')}
                                value={filters.publisher_id}
                                key={filters.publisher_id}
                                onChange={(val) => updateFilters({ publisher_id: val })}
                                options={publishers.map((item: any) => ({
                                    value: item.id,
                                    label: currentLocale === 'kh' ? (item.name_kh ?? item.name) : item.name,
                                    items_count: item.publisher_items_count,
                                }))}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}
                {advisors?.length > 0 && (
                    <AccordionItem value="advisors" key="advisors">
                        <AccordionTrigger className="font-semibold">{t('Advisors')}</AccordionTrigger>
                        <AccordionContent>
                            <LibrarySidebarList
                                heading={t('All Advisors')}
                                value={filters.advisor_id}
                                key={filters.advisor_id}
                                onChange={(val) => updateFilters({ advisor_id: val })}
                                options={advisors.map((item: any) => ({
                                    value: item.id,
                                    label: currentLocale === 'kh' ? (item.name_kh ?? item.name) : item.name,
                                    items_count: item.advisor_items_count,
                                }))}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}
                {languages?.length > 0 && (
                    <AccordionItem value="languages" key="languages" className="border-b-0">
                        <AccordionTrigger className="font-semibold">{t('Languages')}</AccordionTrigger>
                        <AccordionContent>
                            <LibrarySidebarList
                                heading={t('All Languages')}
                                value={filters.language_code}
                                key={filters.language_code}
                                onChange={(val) => updateFilters({ language_code: val })}
                                options={languages.map((item: any) => ({
                                    value: item.code,
                                    label: currentLocale === 'kh' ? (item.name_kh ?? item.name) : item.name,
                                    items_count: item.items_count,
                                }))}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
            <div className="flex justify-end">
                <button onClick={resetFilter} className="mt-2 flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted hover:underline">
                    <RotateCwIcon size={18} /> {t('Clear Filter')}
                </button>
            </div>
        </>
    );
}
