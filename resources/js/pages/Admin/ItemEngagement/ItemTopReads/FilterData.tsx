import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const query = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        device_type: query.get('device_type') || '',
        period: query.get('period') || 'this_month', // default to month
    });

    const updateFilters = (updates: Partial<typeof filters>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        applyFilter(newFilters);
    };

    const applyFilter = (f = filters) => {
        const params = new URLSearchParams();

        if (f.device_type) params.set('device_type', f.device_type);
        if (f.period) params.set('period', f.period);

        params.set('page', '1');

        router.get(`${currentPath}?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => updateFilters({ device_type: '', period: 'month' });

    return (
        <div className="flex items-center gap-2">
            <div className="mb-4">
                <FormLabel label="Device" />
                <ComboboxSelect
                    options={[
                        { value: '', label: 'All Devices' },
                        { value: 'desktop', label: 'Desktop' },
                        { value: 'mobile', label: 'Mobile' },
                    ]}
                    value={filters.device_type}
                    onChange={(val) => updateFilters({ device_type: val })}
                    placeholder="Select Device..."
                    className="mt-1"
                />
            </div>

            {/* Period */}
            <div className="mb-4">
                <FormLabel label="Top Views" />
                <ComboboxSelect
                    options={[
                        { value: 'day', label: 'Today' },
                        { value: 'this_week', label: 'This Week' },
                        { value: 'last_week', label: 'Last Week' },
                        { value: 'this_month', label: 'This Month' },
                        { value: 'last_month', label: 'Last Month' },
                        { value: 'last_3_month', label: 'Last 3 Months' },
                        { value: 'this_year', label: 'This Year' },
                        { value: 'last_year', label: 'Last Year' },
                        { value: 'all_time', label: 'All Time' },
                    ]}
                    value={filters.period}
                    onChange={(val) => updateFilters({ period: val })}
                    placeholder="Select Period..."
                    className="mt-1"
                />
            </div>
        </div>
    );
};

export default FilterData;
