import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import debounce from 'debounce';
import { SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface TableDataSearchProps {
    placeholder?: string;
    className?: string;
    onSearch?: (value: string) => void;
}

const TableDataSearch = ({ placeholder = 'Search...', className, onSearch }: TableDataSearchProps) => {
    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [search, setSearch] = useState(initialQueryParams.get('search') || '');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { t } = useTranslation();

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            if (onSearch) {
                onSearch(searchTerm);
            } else if (currentPath) {
                const queryParams = new URLSearchParams(window.location.search);
                if (searchTerm) queryParams.set('search', searchTerm);
                else queryParams.delete('search');
                queryParams.set('page', '1');
                router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
            }
        }, 500),
        [currentPath, onSearch],
    );

    useEffect(() => {
        return () => debouncedSearch.clear();
    }, [debouncedSearch]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            debouncedSearch(search);
        }
    };

    return (
        <div
            className={cn(
                'group flex w-full flex-1 items-center rounded border ring-primary/20 transition-colors focus-within:border-primary focus-within:ring-4 md:w-sm dark:ring-primary/50',
                className,
            )}
        >
            <Input
                type="search"
                value={search}
                placeholder={t(placeholder)}
                className="flex-1 border-0 bg-background pl-2 text-base shadow-none focus-visible:ring-0 sm:pl-3 sm:text-lg"
                onChange={(e) => {
                    setSearch(e.target.value);
                    debouncedSearch(e.target.value);
                }}
                onKeyDown={handleKeyDown}
            />

            <Button
                variant="ghost"
                size="sm"
                className="h-full rounded-[2.8px] bg-muted group-focus-within:text-primary hover:bg-primary hover:text-white"
                type="button"
                onClick={() => debouncedSearch(search)}
            >
                <SearchIcon className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default TableDataSearch;
