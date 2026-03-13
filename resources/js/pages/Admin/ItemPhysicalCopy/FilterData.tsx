import CheckboxCardOption from '@/components/Card/CheckboxCardOption';
import FilterSheet from '@/components/Filter/FilterSheet';
import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { BanIcon, CircleCheckBigIcon, ReplaceAllIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    // Destructuring physical item related props
    const { shelfLocations, libraries, itemTypes } = usePage<any>().props;

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const [filters, setFilters] = useState({
        shelf_location_code: initialQueryParams.get('shelf_location_code') || '',
        current_library_code: initialQueryParams.get('current_library_code') || '',
        home_library_code: initialQueryParams.get('home_library_code') || '',
        item_type_code: initialQueryParams.get('item_type_code') || '',
        item_lost: initialQueryParams.get('item_lost') || '',
        not_for_loan: initialQueryParams.get('not_for_loan') || '',
        damaged: initialQueryParams.get('damaged') || '',
        withdrawn: initialQueryParams.get('withdrawn') || '',
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

        Object.entries(f).forEach(([key, value]) => {
            value ? queryParams.set(key, value) : queryParams.delete(key);
        });

        queryParams.set('page', '1');
        router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => {
        const cleared = {
            shelf_location_code: '',
            current_library_code: '',
            home_library_code: '',
            item_type_code: '',
            item_lost: '',
            not_for_loan: '',
            damaged: '',
            withdrawn: '',
            trashed: '',
        };
        setFilters(cleared);
        applyFilter(cleared);
    };

    const { t } = useTranslation();

    // Logic-based status options
    const booleanOptions = [
        { value: '', label: t('All'), icon: ReplaceAllIcon },
        { value: '1', label: t('Yes'), icon: CircleCheckBigIcon },
        { value: '0', label: t('No'), icon: BanIcon },
    ];
    const not_for_loanOptions = [
        { value: '', label: t('All'), icon: ReplaceAllIcon },
        { value: '0', label: t('Allow'), icon: BanIcon },
        { value: '1', label: t('Not Allow'), icon: CircleCheckBigIcon },
    ];

    const trashedOptions = [
        { value: '', label: t('Active'), icon: CircleCheckBigIcon },
        { value: 'with', label: t('All Records'), icon: ReplaceAllIcon },
        { value: 'only', label: t('Deleted'), icon: Trash2Icon },
    ];

    return (
        <FilterSheet handleFilter={applyFilter} resetFilter={resetFilter} isFiltered={Object.values(filters).some((x) => x !== '')}>
            <div className="mb-4">
                <FormLabel label="Shelf Location" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All Shelf Locations') },
                        ...(shelfLocations?.map((item: any) => ({
                            value: item.code,
                            label: item.name,
                        })) || []),
                    ]}
                    value={filters.shelf_location_code}
                    onChange={(val) => updateFilters({ shelf_location_code: val })}
                    placeholder="Select Shelf Location..."
                    className="mt-1"
                />
            </div>

            {/* Item Type Filter */}
            <div className="mb-4">
                <FormLabel label="Item Type" />
                <ComboboxSelect
                    options={[
                        { value: '', label: t('All Types') },
                        ...(itemTypes?.map((item: any) => ({
                            value: item.code,
                            label: item.name,
                        })) || []),
                    ]}
                    value={filters.item_type_code}
                    onChange={(val) => updateFilters({ item_type_code: val })}
                    placeholder="Select Item Type..."
                    className="mt-1"
                />
            </div>

            <hr className="my-6 border-dashed" />

            {/* Status Flags Group */}
            <div className="space-y-6">
                <div>
                    <FormLabel label="Allow Checkout" />
                    <div className="mt-1 grid grid-cols-3 gap-2">
                        {not_for_loanOptions.map((opt) => (
                            <CheckboxCardOption
                                key={opt.value}
                                option={opt}
                                checked={filters.not_for_loan === opt.value}
                                onChange={(val) => updateFilters({ not_for_loan: val })}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <FormLabel label="Lost" />
                    <div className="mt-1 grid grid-cols-3 gap-2">
                        {booleanOptions.map((opt) => (
                            <CheckboxCardOption
                                key={opt.value}
                                option={opt}
                                checked={filters.item_lost === opt.value}
                                onChange={(val) => updateFilters({ item_lost: val })}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <FormLabel label="Damaged" />
                    <div className="mt-1 grid grid-cols-3 gap-2">
                        {booleanOptions.map((opt) => (
                            <CheckboxCardOption
                                key={opt.value}
                                option={opt}
                                checked={filters.damaged === opt.value}
                                onChange={(val) => updateFilters({ damaged: val })}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <FormLabel label="Withdrawn" />
                    <div className="mt-1 grid grid-cols-3 gap-2">
                        {booleanOptions.map((opt) => (
                            <CheckboxCardOption
                                key={opt.value}
                                option={opt}
                                checked={filters.withdrawn === opt.value}
                                onChange={(val) => updateFilters({ withdrawn: val })}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <hr className="my-6 border-dashed" />

            {/* Trashed Filter */}
            <div className="mb-4">
                <FormLabel label="Status" />
                <div className="mt-1 grid grid-cols-3 gap-3">
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
