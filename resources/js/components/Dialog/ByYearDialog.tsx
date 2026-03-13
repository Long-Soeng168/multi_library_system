import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import * as React from 'react';

export default function ByYearDialog() {
    const [open, setOpen] = React.useState(false);

    const { t } = useTranslation();

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    // Only one source of truth: filters
    const [filters, setFilters] = React.useState({
        from_year: initialQueryParams.get('from_year') || '',
        to_year: initialQueryParams.get('to_year') || '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const start = parseInt(filters.from_year, 10);
        const end = parseInt(filters.to_year, 10);

        if (start && end && start > end) {
            alert('Start year cannot be after end year');
            return;
        }

        updateFilters({
            from_year: filters.from_year,
            to_year: filters.to_year,
        });

        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={`h-11 w-full rounded-md border border-primary/50 bg-muted text-foreground hover:bg-primary hover:text-white focus-visible:outline-none ${(filters.from_year || filters.to_year) && ''}`}
                >
                    {filters.from_year || filters.to_year ? (
                        <div className="flex items-center justify-center gap-1">
                            <span>{filters.from_year || '...'}</span>
                            <span>→</span>
                            <span>{filters.to_year || '...'}</span>
                        </div>
                    ) : (
                        t('Select Year')
                    )}
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <DialogHeader>
                        <DialogTitle>{t('Filter by Published Year')}</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <Label htmlFor="start-year">{t('From Year')}</Label>
                            <Input
                                id="start-year"
                                type="number"
                                min={1800}
                                max={new Date().getFullYear() + 1}
                                placeholder="e.g., 2010"
                                value={filters.from_year}
                                onChange={(e) => updateFilters({ from_year: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="end-year">{t('To Year')}</Label>
                            <Input
                                id="end-year"
                                type="number"
                                min={1800}
                                max={new Date().getFullYear() + 1}
                                placeholder="e.g., 2023"
                                value={filters.to_year}
                                onChange={(e) => updateFilters({ to_year: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t('Cancel')}</Button>
                        </DialogClose>
                        <Button type="submit">{t('Apply')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
