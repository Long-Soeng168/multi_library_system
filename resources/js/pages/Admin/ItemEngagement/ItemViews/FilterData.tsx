import { FormLabel } from '@/components/Input/FormLabel';
import { ComboboxSelect } from '@/components/Section/ComboboxSelect';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const FilterData = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const query = new URLSearchParams(window.location.search);

    const [filters, setFilters] = useState({
        device_type: query.get('device_type') || '',
        from_date: query.get('from_date') || '',
        to_date: query.get('to_date') || '',
    });

    const updateFilters = (updates: Partial<typeof filters>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        applyFilter(newFilters);
    };

    const applyFilter = (f = filters) => {
        const params = new URLSearchParams();

        if (f.device_type) params.set('device_type', f.device_type);
        if (f.from_date) params.set('from_date', f.from_date);
        if (f.to_date) params.set('to_date', f.to_date);

        params.set('page', '1');

        router.get(`${currentPath}?${params.toString()}`, {}, { preserveState: true, preserveScroll: true });
    };

    const resetFilter = () => updateFilters({ device_type: '', from_date: '', to_date: '' });

    return (
        <div className="flex items-center gap-2">
            {/* Device */}
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

            {/* From */}
            <div className="mb-4">
                <FormLabel label="From Date" />
                <Input
                    type="date"
                    value={filters.from_date}
                    onChange={(e) => updateFilters({ from_date: e.target.value })}
                    className="input mt-1 w-full"
                />
            </div>

            {/* To */}
            <div className="mb-4">
                <FormLabel label="To Date" />
                <Input
                    type="date"
                    value={filters.to_date}
                    onChange={(e) => updateFilters({ to_date: e.target.value })}
                    className="input mt-1 w-full"
                />
            </div>
        </div>
    );
};

export default FilterData;
