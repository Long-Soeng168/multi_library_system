import ExportButton from '@/components/Button/ExportButton';
import RefreshButton from '@/components/Button/RefreshButton';
import LibraryStatusCard from '@/components/Card/LibraryStatusCard';
import FilterByLibrary from '@/components/Filter/FilterByLibrary';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import usePermission from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import FilterData from './FilterData';
import TableData from './TableData';

const Index = () => {
    const { user_library } = usePage<any>().props;
    const hasPermission = usePermission();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'All Physical Copies',
            href: hasPermission('item view') ? '/admin/items-physical-copies' : `/dashboard/library/${user_library?.code}/items-physical-copies`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <LibraryStatusCard />
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-6 pb-5">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                        <TableDataSearch />
                        <RefreshButton />
                    </div>
                    <div className="flex w-full justify-end gap-2 md:w-auto">
                        {/* Add New Dialog */}
                        <ExportButton endpoint="/item-physical-copies-export" label="Export Excel" />
                    </div>
                </div>
                <FilterByLibrary />
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
