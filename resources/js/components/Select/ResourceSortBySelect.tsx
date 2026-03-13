import { Check } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';

export default function ResourceSortBySelect() {
    const [open, setOpen] = React.useState(false);

    const sortOptions = [
        { value: 'latest', label: 'Latest Published' },
        { value: 'oldest', label: 'Oldest Published' },
        { value: 'title-asc', label: 'Title A → Z' },
        { value: 'title-desc', label: 'Title Z → A' },
        { value: 'most-view', label: 'Most View' },
        // { value: 'most-read', label: 'Most Read' },
    ];

    const { t, currentLocale } = useTranslation();

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    const [filters, setFilters] = React.useState({
        sort_by: initialQueryParams.get('sort_by') || '',
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
            if (value) queryParams.set(key, value);
            else queryParams.delete(key);
        });

        queryParams.set('page', '1');

        router.visit(`${currentPath}?${queryParams.toString()}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const selectedSort = sortOptions.find((o) => o.value === filters.sort_by);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={`h-11 rounded-md border border-transparent bg-muted text-foreground hover:bg-primary hover:text-white ${filters.sort_by && 'border-primary ring-4 ring-primary/20'}`}
                >
                    {t(selectedSort?.label ?? 'Sort By')}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {sortOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                        updateFilters({
                                            sort_by: filters.sort_by === option.value ? '' : option.value,
                                        });
                                        setOpen(false);
                                    }}
                                >
                                    {t(option.label)}
                                    <Check className={cn('ml-auto', filters.sort_by === option.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
