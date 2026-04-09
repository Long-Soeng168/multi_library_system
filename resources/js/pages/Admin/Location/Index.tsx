import NewItemButton from '@/components/Button/NewItemButton';
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
            title: 'Locations',
            href: hasPermission('item view') ? '/admin/locations' : `/dashboard/library/${user_library?.code}/shelf-locations`,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <LibraryStatusCard />
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-6">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                        <TableDataSearch />
                        <RefreshButton />
                    </div>
                    <div className="flex w-full justify-end md:w-auto">
                        {/* Add New Dialog */}
                        <>
                            {(hasPermission('item view') || user_library?.status == 'active') && (
                                <NewItemButton
                                    url={
                                        hasPermission('item view')
                                            ? '/admin/shelf-locations/create'
                                            : `/dashboard/library/${user_library?.code}/shelf-locations/create`
                                    }
                                    permission=""
                                />
                            )}
                        </>
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
