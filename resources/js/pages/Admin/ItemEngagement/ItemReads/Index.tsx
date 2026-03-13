import RefreshButton from '@/components/Button/RefreshButton';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import FilterData from './FilterData';
// import SummaryCards from './SummaryCards';
import FilterMainCategory from '../../Item/FilterMainCategory';
import SummaryCards from './SummaryCards';
import TableData from './TableData';

const Index = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Engagement', href: '/admin/item-views' },
        { title: 'Item Reads', href: '/admin/item-reads' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <SummaryCards />

                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-4">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                    </div>

                    <div className="flex w-full justify-end gap-2 md:w-auto">
                        <TableDataSearch />
                        <RefreshButton />
                    </div>
                </div>

                <div className="m-2 rounded bg-muted pt-2">
                    <FilterMainCategory />
                </div>
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
