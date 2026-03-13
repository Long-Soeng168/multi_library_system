import { TableHead } from '@/components/ui/table';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';

interface TableHeadWithSortProps {
    field?: string;
    label: string;
}

const TableHeadWithSort = ({ field, label }: TableHeadWithSortProps) => {
    const { t } = useTranslation();
    const { url } = usePage(); // ✅ SSR safe
    const [currentPath, search = ''] = url.split('?');
    const queryParams = new URLSearchParams(search);

    const currentSortBy = queryParams.get('sortBy');
    const currentSortDirection = queryParams.get('sortDirection') as 'asc' | 'desc' | null;

    const isActive = currentSortBy === field;

    const handleSort = (fieldName: string) => {
        if (fieldName === currentSortBy) {
            queryParams.set('sortDirection', currentSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            queryParams.set('sortBy', fieldName);
            queryParams.set('sortDirection', 'asc');
        }
        router.get(`${currentPath}?${queryParams.toString()}`);
    };

    return (
        <TableHead onClick={() => field && handleSort(field)}>
            <div className="flex cursor-pointer items-center gap-1 select-none" title={`Sort by ${label}`}>
                {field && <ArrowUpDown size={16} className={isActive ? 'text-black' : 'text-muted-foreground'} />}
                <span className="max-w-[250px] overflow-x-hidden text-ellipsis">{t(label)}</span>
                {isActive && <span className="text-xs text-muted-foreground">({currentSortDirection && t(currentSortDirection)})</span>}
            </div>
        </TableHead>
    );
};

export default TableHeadWithSort;
