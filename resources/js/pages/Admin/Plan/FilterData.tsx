import CheckboxCardOption from '@/components/Card/CheckboxCardOption';
import FilterSheet from '@/components/Filter/FilterSheet';
import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { CircleCheckBigIcon, DollarSignIcon, ReplaceAllIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const [filters, setFilters] = useState({
        trashed: initialQueryParams.get('trashed') || '',
        billing_cycle: initialQueryParams.get('billing_cycle') || '',
        is_popular: initialQueryParams.get('is_popular') || '',
        type: initialQueryParams.get('type') || '', // free | paid
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
        f.billing_cycle ? queryParams.set('billing_cycle', f.billing_cycle) : queryParams.delete('billing_cycle');
        f.is_popular ? queryParams.set('is_popular', f.is_popular) : queryParams.delete('is_popular');
        f.type ? queryParams.set('type', f.type) : queryParams.delete('type');

        queryParams.set('page', '1');

        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () =>
        updateFilters({
            trashed: '',
            billing_cycle: '',
            is_popular: '',
            type: '',
        });

    const { t } = useTranslation();

    const trashedOptions = [
        { value: '', label: t('Without Trashed'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('With Trashed'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Only Trashed'), icon: Trash2Icon },
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={Object.values(filters).some(Boolean)}>
            {/* Billing Cycle */}
            <div className="mb-4">
                <FormLabel label={t('Billing Cycle')} />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All') },
                        { value: 'monthly', label: t('Monthly') },
                        { value: 'yearly', label: t('Yearly') },
                    ]}
                    value={filters.billing_cycle}
                    onChange={(val) => updateFilters({ billing_cycle: val })}
                    placeholder={t('Select Billing Cycle')}
                    className="mt-1"
                />
            </div>

            {/* Plan Type */}
            <div className="mb-4">
                <FormLabel label={t('Plan Type')} />
                <div className="mt-1 grid grid-cols-2 gap-3">
                    <CheckboxCardOption
                        option={{ value: 'free', label: t('Free'), icon: CircleCheckBigIcon }}
                        checked={filters.type === 'free'}
                        onChange={(value) => updateFilters({ type: value })}
                    />
                    <CheckboxCardOption
                        option={{ value: 'paid', label: t('Paid'), icon: DollarSignIcon }}
                        checked={filters.type === 'paid'}
                        onChange={(value) => updateFilters({ type: value })}
                    />
                </div>
            </div>

            {/* Popular */}
            <div className="mb-4">
                <FormLabel label={t('Popular')} />
                <CheckboxCardOption
                    option={{ value: '1', label: t('Popular Only'), icon: StarIcon }}
                    checked={filters.is_popular === '1'}
                    onChange={(value) => updateFilters({ is_popular: value })}
                />
            </div>

            {/* Trashed */}
            <div className="mb-4">
                <FormLabel label={t('Trashed')} />
                <div className="mt-1 grid w-full grid-cols-3 gap-3">
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
