import ExportButton from '@/components/Button/ExportButton';
import NewItemButton from '@/components/Button/NewItemButton';
import RefreshButton from '@/components/Button/RefreshButton';
import FilterByLibrary from '@/components/Filter/FilterByLibrary';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import usePermission from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import FilterData from './FilterData';
import FilterMainCategory from './FilterMainCategory';
import TableData from './TableData';

const Index = () => {
    const { user_library } = usePage<any>().props;
    const hasPermission = usePermission();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Items',
            href: hasPermission('item view') ? '/admin/items' : `/dashboard/library/${user_library?.code}/items`,
        },
    ];
    const { main_category_code } = usePage<any>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-6 pb-5">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                        <TableDataSearch />
                        <RefreshButton />
                    </div>
                    <div className="flex w-full justify-end gap-2 md:w-auto">
                        {/* Add New Dialog */}
                        <ExportButton endpoint="/items-export" label="Export Excel" />
                        <NewItemButton
                            url={
                                hasPermission('item view')
                                    ? `/admin/items/create?main_category_code=${main_category_code || ''}`
                                    : `/dashboard/library/${user_library?.code}/items/create?main_category_code=${main_category_code || ''}`
                            }
                            permission=""
                        />
                    </div>
                </div>
                <FilterByLibrary />
                <FilterMainCategory />
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
