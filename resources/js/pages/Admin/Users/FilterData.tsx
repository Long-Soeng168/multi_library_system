import CheckboxCardOption from '@/components/Card/CheckboxCardOption';
import FilterSheet from '@/components/Filter/FilterSheet';
import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { CircleCheckBigIcon, ReplaceAllIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Role {
    name: string;
}

const FilterData = () => {
    const { t } = useTranslation();
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { roles } = usePage<{ roles: Role[] }>().props;

    // Source of Truth: The URL
    const getParams = () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');

    const [filters, setFilters] = useState({
        role: getParams().get('role') || '',
        trashed: getParams().get('trashed') || '',
    });

    // Sync local state when URL changes (e.g., when RoleFilter row is clicked)
    useEffect(() => {
        const params = getParams();
        setFilters({
            role: params.get('role') || '',
            trashed: params.get('trashed') || '',
        });
    }, [window.location.search]); // Listens for URL changes

    const updateFilters = (updates: Partial<typeof filters>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        applyFilter(newFilters);
    };

    const applyFilter = (appliedFilters?: typeof filters) => {
        if (!currentPath) return;
        const f = appliedFilters ?? filters;
        const queryParams = new URLSearchParams(window.location.search);

        f.role ? queryParams.set('role', f.role) : queryParams.delete('role');
        f.trashed ? queryParams.set('trashed', f.trashed) : queryParams.delete('trashed');
        queryParams.set('page', '1');

        router.get(
            `${currentPath}?${queryParams.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const resetFilter = () => updateFilters({ role: '', trashed: '' });

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon },
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={!!filters.role || !!filters.trashed}>
            <div className="mb-4">
                <FormLabel label="Role" />
                <ComboboxSelect
                    options={[{ value: '', label: t('All') }, ...roles.map((r) => ({ value: r.name, label: r.name }))]}
                    value={filters.role}
                    onChange={(val) => updateFilters({ role: val })}
                    placeholder="Select Role..."
                    searchPlaceholder="Search Role..."
                    className="mt-1"
                />
            </div>

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
