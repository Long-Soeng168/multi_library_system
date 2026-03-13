import NewItemButton from '@/components/Button/NewItemButton';
import RefreshButton from '@/components/Button/RefreshButton';
import FilterByLibrary from '@/components/Filter/FilterByLibrary';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import TableData from './TableData';

const Index = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Circulation Rules',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-6">
                    <div className="flex w-full gap-2 md:w-auto">
                        <TableDataSearch />
                        <RefreshButton />
                    </div>
                    <div className="flex w-full justify-end md:w-auto">
                        {/* Updated URL and Permission to match your CirculationRuleController. 
                            If a rule already exists, your Controller index() will redirect 
                            them to the Edit page anyway.
                        */}
                        <NewItemButton url="/admin/circulation-rules/create" permission="circulation create" />
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
