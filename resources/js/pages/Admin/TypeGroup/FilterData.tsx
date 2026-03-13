import CheckboxCardOption from '@/components/Card/CheckboxCardOption';
import FilterSheet from '@/components/Filter/FilterSheet';
import { FormLabel } from '@/components/Input/FormLabel';
import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { CircleCheckBigIcon, ReplaceAllIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface Role {
    name: string;
}

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [filters, setFilters] = useState({
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

        f.trashed ? queryParams.set('trashed', f.trashed) : queryParams.delete('trashed');
        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => updateFilters({ trashed: '' });

    const { t } = useTranslation();

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon }, // items that are not deleted
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon }, // include deleted items, restore icon fits
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon }, // only deleted items, eye-off indicates hidden
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={!!filters.trashed}>
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

            {/* <button className="flex cursor-pointer items-center gap-2 py-2 hover:text-primary hover:underline" onClick={resetFilter}>
                <RefreshCcwIcon size={16} /> Reset Filter
            </button> */}
        </FilterSheet>
    );
};

export default FilterData;
