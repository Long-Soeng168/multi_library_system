import ExportButton from '@/components/Button/ExportButton';
import NewItemButton from '@/components/Button/NewItemButton';
import RefreshButton from '@/components/Button/RefreshButton';
import LibraryStatusCard from '@/components/Card/LibraryStatusCard';
import LimitReachedDialog from '@/components/Dialog/LimitReachedDialog';
import FilterByLibrary from '@/components/Filter/FilterByLibrary';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import usePermission from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import FilterData from './FilterData';
import FilterRole from './FilterRole';
import TableData from './TableData';

const Index = () => {
    const { user_library, user_active_plan } = usePage<any>().props;
    const hasPermission = usePermission();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Users',
            href: hasPermission('user view') ? '/admin/users' : `/dashboard/library/${user_library?.code}/users`,
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
                        <ExportButton endpoint="/users-export" />
                        {!hasPermission('user view') && user_library?.items_count >= user_active_plan?.plan?.max_books ? (
                            <LimitReachedDialog />
                        ) : (
                            <>
                                {(hasPermission('user view') || user_library?.status == 'active') && (
                                    <NewItemButton
                                        url={
                                            hasPermission('user view')
                                                ? '/admin/users/create'
                                                : `/dashboard/library/${user_library?.code}/users/create`
                                        }
                                        permission=""
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
                <FilterByLibrary />
                <FilterRole />
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
