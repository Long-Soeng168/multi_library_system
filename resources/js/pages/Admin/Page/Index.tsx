import NewItemButton from '@/components/Button/NewItemButton';
import RefreshButton from '@/components/Button/RefreshButton';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import FilterData from './FilterData';
import ParentBreadcrumb from './ParentBreadcrumb';
import TableData from './TableData';
import HelpDialog from './HelpDialog';

const Index = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Pages',
            href: '/admin/pages',
        },
    ];

    const { selectedPage } = usePage<any>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-6">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                        <TableDataSearch />
                        <RefreshButton />
                        <HelpDialog />
                    </div>
                    <div className="flex w-full justify-end md:w-auto">
                        {/* Add New Dialog */}
                        <NewItemButton
                            url={`/admin/pages/create${selectedPage?.code ? '?selected_page_code=' + selectedPage?.code : ''}`}
                            permission="page create"
                        />
                    </div>
                </div>
                <ParentBreadcrumb />
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
