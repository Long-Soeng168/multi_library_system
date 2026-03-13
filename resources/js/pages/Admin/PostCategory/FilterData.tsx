import CheckboxCardOption from '@/components/Card/CheckboxCardOption';
import FilterSheet from '@/components/Filter/FilterSheet';
import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { CircleCheckBigIcon, ReplaceAllIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { parents } = usePage<any>().props;

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [filters, setFilters] = useState({
        category_code: initialQueryParams.get('category_code') || '',
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

        f.category_code ? queryParams.set('category_code', f.category_code) : queryParams.delete('category_code');
        f.trashed ? queryParams.set('trashed', f.trashed) : queryParams.delete('trashed');
        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => updateFilters({ category_code: '', trashed: '' });

    const { t, currentLocale } = useTranslation();

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon },
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={!!filters.category_code || !!filters.trashed}>
            {/* Group Filter */}
            <div className="mb-4">
                <FormLabel label="Parent" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...parents.map((item: any) => ({
                            value: item.code?.toString(),
                            label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                        })),
                    ]}
                    value={filters.category_code}
                    onChange={(val) => updateFilters({ category_code: val })}
                    placeholder="Select Parent..."
                    searchPlaceholder="Search Parent..."
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
