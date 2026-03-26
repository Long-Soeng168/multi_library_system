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

    const { plans, libraries } = usePage<any>().props;

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const [filters, setFilters] = useState({
        plan_id: initialQueryParams.get('plan_id') || '',
        library_id: initialQueryParams.get('library_id') || '',
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

        f.plan_id ? queryParams.set('plan_id', f.plan_id) : queryParams.delete('plan_id');
        f.library_id ? queryParams.set('library_id', f.library_id) : queryParams.delete('library_id');
        f.status ? queryParams.set('status', f.status) : queryParams.delete('status');
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

    const resetFilter = () =>
        updateFilters({
            plan_id: '',
            library_id: '',
            status: '',
            trashed: '',
        });

    const { t, currentLocale } = useTranslation();

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon },
    ];

    const statusOptions = [
        { value: '', label: t('All') },
        { value: 'active', label: t('Active') },
        { value: 'pending', label: t('Pending') },
        { value: 'rejected', label: t('Rejected') },
        { value: 'expired', label: t('Expired') },
        { value: 'canceled', label: t('Canceled') },
    ];

    return (
        <FilterSheet
            handleFilter={applyFilter}
            resetFilter={resetFilter}
            isFiltered={!!filters.plan_id || !!filters.library_id || !!filters.status || !!filters.trashed}
        >
            {/* Plan Filter */}
            <div className="mb-4">
                <FormLabel label="Plan" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...plans.map((item: any) => ({
                            value: item.id,
                            label: currentLocale === 'kh' ? item.name_kh || item.name : item.name,
                        })),
                    ]}
                    value={filters.plan_id}
                    onChange={(val) => updateFilters({ plan_id: val })}
                    placeholder="Select Plan..."
                    searchPlaceholder="Search Plan..."
                    className="mt-1"
                />
            </div>

            {/* Library Filter */}
            <div className="mb-4">
                <FormLabel label="Library" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        ...libraries.map((item: any) => ({
                            value: item.id,
                            label: currentLocale === 'kh' ? item.name_kh || item.name : item.name,
                        })),
                    ]}
                    value={filters.library_id}
                    onChange={(val) => updateFilters({ library_id: val })}
                    placeholder="Select Library..."
                    searchPlaceholder="Search Library..."
                    className="mt-1"
                />
            </div>

            {/* Status Filter */}
            <div className="mb-4">
                <FormLabel label="Status" />
                <ComboboxSelect
                    options={statusOptions}
                    value={filters.status}
                    onChange={(val) => updateFilters({ status: val })}
                    placeholder="Select Status..."
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
