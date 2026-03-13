import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import debounce from 'debounce';
import { LibraryIcon, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import LoadingOnPrefetch from '../Loading/LoadingOnPrefetch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import useTranslation from '@/hooks/use-translation';

interface LibrarySearchProps {
    debounceSearch?: boolean; // default true
}

const LibrarySearch = ({ debounceSearch = true }: LibrarySearchProps) => {
    const initialQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const [search, setSearch] = useState(initialQueryParams.get('search') || '');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const isOnLibrariesPage = currentPath === '/resources';

    // Only debounce if enabled
    const debouncedSearch = useCallback(
        debounce((searchTerm: string) => {
            if (!isOnLibrariesPage || !debounceSearch) return;
            const queryParams = new URLSearchParams(window.location.search);
            if (searchTerm) queryParams.set('search', searchTerm);
            else queryParams.delete('search');
            queryParams.set('page', '1');
            router.get(`${currentPath}?${queryParams.toString()}`, {}, { preserveState: true, preserveScroll: true });
        }, 500),
        [currentPath, isOnLibrariesPage, debounceSearch],
    );

    useEffect(() => {
        return () => debouncedSearch.clear();
    }, [debouncedSearch]);

    const handleSearch = () => {
        if (isOnLibrariesPage && debounceSearch) {
            debouncedSearch(search);
        } else {
            const queryParams = new URLSearchParams();
            if (search) queryParams.set('search', search);
            router.get(`/resources?${queryParams.toString()}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const { t, currentLocale } = useTranslation();

    return (
        <div className="relative mx-auto w-full max-w-2xl">
            <div
                className={cn(
                    'flex items-center rounded-full border border-primary bg-muted p-2 ring-primary/20 transition-colors focus-within:ring-4 dark:ring-primary/50',
                )}
            >
                <Button variant="ghost" size="icon" className="hidden rounded-full pl-2 hover:bg-accent sm:inline-block">
                    <LibraryIcon className="h-5 w-5 text-primary" />
                </Button>

                <Input
                    type="search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (isOnLibrariesPage && debounceSearch) debouncedSearch(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={t("Search Resources...")}
                    className="flex-1 border-0 bg-transparent pl-2 text-base shadow-none focus-visible:ring-0 sm:pl-3 sm:text-lg"
                />

                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20" onClick={handleSearch}>
                    <SearchIcon className="h-5 w-5 text-primary" />
                </Button>
            </div>
            <div className="h-8">
                <LoadingOnPrefetch />
            </div>
        </div>
    );
};

export default LibrarySearch;
