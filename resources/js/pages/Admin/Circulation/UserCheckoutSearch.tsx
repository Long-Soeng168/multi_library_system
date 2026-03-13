import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import debounce from 'debounce';
import { useCallback, useEffect, useState } from 'react';

interface UserCheckoutSearchProps {
    placeholder?: string;
    className?: string;
    onSearch?: (value: string) => void;
    value?: string;
}

const UserCheckoutSearch = ({ placeholder = 'Search...', className, onSearch, value }: UserCheckoutSearchProps) => {
    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [search, setSearch] = useState(initialQueryParams.get('search') || '');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { t } = useTranslation();

    // Listen to external value changes (like setting to "" from parent)
    useEffect(() => {
        if (value !== undefined) {
            setSearch(value);
            debouncedSearch('');
        }
    }, [value]);

    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            if (onSearch) {
                onSearch(searchTerm);
            }
            if (currentPath) {
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
        <div className={cn('relative mx-auto w-full max-w-full min-w-[250px]', className)}>
            <div
                className={`group flex h-11 items-center overflow-hidden rounded-md border ring-primary/20 transition-colors focus-within:border-primary focus-within:ring-4 dark:ring-primary/50 ${search && 'border-primary'}`}
            >
                <span className={`flex h-full items-center justify-center pl-1.5 group-focus-within:text-primary ${search && 'text-primary'}`}>
                    <SearchIcon className="mt-[2px] size-7 pl-1" />
                </span>
                <Input
                    type="search"
                    value={search}
                    placeholder={t(placeholder)}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        debouncedSearch(e.target.value);
                    }}
                    autoFocus
                    onKeyDown={handleKeyDown}
                    className="flex-1 border-0 bg-background text-lg shadow-none focus-visible:ring-0 sm:text-lg"
                />
                <button
                    type="button"
                    onClick={() => debouncedSearch(search)}
                    className={`h-full cursor-pointer border-l bg-muted px-4 font-medium duration-100 group-focus-within:border-l-primary group-focus-within:text-primary hover:bg-true-primary/90 hover:text-white ${search && 'border-l-primary text-primary'}`}
                >
                    {t('Search')}
                </button>
            </div>
        </div>
    );
};

export default UserCheckoutSearch;
