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
    const { types } = usePage<any>().props;

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [filters, setFilters] = useState({
        type_code: initialQueryParams.get('type_code') || '',
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
        f.trashed ? queryParams.set('trashed', f.trashed) : queryParams.delete('trashed');
        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => updateFilters({ type_code: '', trashed: '' });

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
