import CheckboxCardOption from '@/components/Card/CheckboxCardOption';
import FilterSheet from '@/components/Filter/FilterSheet';
import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import { postStatusData } from '@/data/status-data';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { CircleCheckBigIcon, ReplaceAllIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { fileTypes, languages, authors, publishers, advisors } = usePage<any>().props;

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [filters, setFilters] = useState({
        file_type_code: initialQueryParams.get('file_type_code') || '',
        language_code: initialQueryParams.get('language_code') || '',
        author_id: initialQueryParams.get('author_id') || '',
        publisher_id: initialQueryParams.get('publisher_id') || '',
        advisor_id: initialQueryParams.get('advisor_id') || '',
        status: initialQueryParams.get('status') || '',
        trashed: initialQueryParams.get('trashed') || '',
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

        f.file_type_code ? queryParams.set('file_type_code', f.file_type_code) : queryParams.delete('file_type_code');
        f.language_code ? queryParams.set('language_code', f.language_code) : queryParams.delete('language_code');
        f.author_id ? queryParams.set('author_id', f.author_id) : queryParams.delete('author_id');
        f.publisher_id ? queryParams.set('publisher_id', f.publisher_id) : queryParams.delete('publisher_id');
        f.advisor_id ? queryParams.set('advisor_id', f.advisor_id) : queryParams.delete('advisor_id');
        f.status ? queryParams.set('status', f.status) : queryParams.delete('status');
        f.trashed ? queryParams.set('trashed', f.trashed) : queryParams.delete('trashed');
        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () =>
        updateFilters({ file_type_code: '', language_code: '', author_id: '', publisher_id: '', status: '', trashed: '' });

    const { t, currentLocale } = useTranslation();

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon },
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={!!filters.file_type_code || !!filters.trashed}>
            {/* Filter */}
            <div className="mb-4">
                <FormLabel label="Author" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...authors.map((item: any) => ({
                            value: item.id?.toString(),
                            label: `${currentLocale === 'kh' ? item.name_kh || item.name : item.name} (${item.author_items_count})`,
                        })),
                    ]}
                    value={filters.author_id?.toString()}
                    onChange={(val) => updateFilters({ author_id: val })}
                    placeholder="Select Author..."
                    searchPlaceholder="Search Author..."
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <FormLabel label="Publisher" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...publishers.map((item: any) => ({
                            value: item.id?.toString(),
                            label: `${currentLocale === 'kh' ? item.name_kh || item.name : item.name} (${item.publisher_items_count})`,
                        })),
                    ]}
                    value={filters.publisher_id?.toString()}
                    onChange={(val) => updateFilters({ publisher_id: val })}
                    placeholder="Select Publisher..."
                    searchPlaceholder="Search Publisher..."
                    className="mt-1"
                />
            </div>
            {/* <div className="mb-4">
                <FormLabel label="Advisor" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...advisors.map((item: any) => ({
                            value: item.id?.toString(),
                            label: `${currentLocale === 'kh' ? item.name_kh || item.name : item.name} (${item.advisor_items_count})`,
                        })),
                    ]}
                    value={filters.advisor_id?.toString()}
                    onChange={(val) => updateFilters({ advisor_id: val })}
                    placeholder="Select Advisor..."
                    searchPlaceholder="Search Advisor..."
                    className="mt-1"
                />
            </div> */}
            <div className="mb-4">
                <FormLabel label="Language" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...languages.map((item: any) => ({
                            value: item.code,
                            label: `${currentLocale === 'kh' ? item.name_kh || item.name : item.name} (${item.items_count})`,
                        })),
                    ]}
                    value={filters.language_code}
                    onChange={(val) => updateFilters({ language_code: val })}
                    placeholder="Select Language..."
                    searchPlaceholder="Search Language..."
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <FormLabel label="Type" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...fileTypes.map((item: any) => ({
                            value: item.code,
                            label: `${currentLocale === 'kh' ? item.name_kh || item.name : item.name} (${item.file_type_items_count})`,
                        })),
                    ]}
                    value={filters.file_type_code}
                    onChange={(val) => updateFilters({ file_type_code: val })}
                    placeholder="Select Type..."
                    searchPlaceholder="Search Type..."
                    className="mt-1"
                />
            </div>

            <div className="mb-4">
                <FormLabel label="Status" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...postStatusData.map((item: any) => ({
                            value: item.value,
                            label: t(item.label),
                        })),
                    ]}
                    value={filters.status}
                    onChange={(val) => updateFilters({ status: val })}
                    placeholder="Select Status..."
                    searchPlaceholder="Search Status..."
                    className="mt-1"
                />
            </div>
            {/* Trashed Filter */}
            <div className="mb-4">
                <FormLabel label="Trashed" />
                <div className="mt-1 grid w-full max-w-sm grid-cols-3 gap-3">
                    {trashedOptions.map((option) => (
                        <CheckboxCardOption
                            key={option.value}
                            option={option}
                            checked={filters.trashed === option.value}
                            onChange={(value) => updateFilters({ trashed: value })}
                        />
                    ))}
                </div>
            </div>
        </FilterSheet>
    );
};

export default FilterData;
