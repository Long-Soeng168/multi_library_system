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
    const { types, categories, languages } = usePage<any>().props;

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [filters, setFilters] = useState({
        type_code: initialQueryParams.get('type_code') || '',
        category_code: initialQueryParams.get('category_code') || '',
        language_code: initialQueryParams.get('language_code') || '',
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

        f.type_code ? queryParams.set('type_code', f.type_code) : queryParams.delete('type_code');
        f.category_code ? queryParams.set('category_code', f.category_code) : queryParams.delete('category_code');
        f.language_code ? queryParams.set('language_code', f.language_code) : queryParams.delete('language_code');
        f.status ? queryParams.set('status', f.status) : queryParams.delete('status');
        f.trashed ? queryParams.set('trashed', f.trashed) : queryParams.delete('trashed');
        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => updateFilters({ type_code: '', category_code: '', language_code: '', status: '', trashed: '' });

    const { t, currentLocale } = useTranslation();

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon },
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={!!filters.type_code || !!filters.trashed}>
            {/* Filter */}
            <div className="mb-4">
                <FormLabel label="Category" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...categories.map((item: any) => ({
                            value: item.code,
                            label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                        })),
                    ]}
                    value={filters.category_code}
                    onChange={(val) => updateFilters({ category_code: val })}
                    placeholder="Select Category..."
                    searchPlaceholder="Search Category..."
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <FormLabel label="Language" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...languages.map((item: any) => ({
                            value: item.code,
                            label: `${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
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
            <div className="mb-4">
                <FormLabel label="Type" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...types.map((item: any) => ({
                            value: item.code,
                            label: currentLocale === 'kh' ? item.name_kh || item.name : item.name,
                        })),
                    ]}
                    value={filters.type_code}
                    onChange={(val) => updateFilters({ type_code: val })}
                    placeholder="Select Type..."
                    searchPlaceholder="Search Type..."
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
