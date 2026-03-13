import ExportButton from '@/components/Button/ExportButton';
import RefreshButton from '@/components/Button/RefreshButton';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import FilterData from './FilterData';
import SummaryCards from './SummaryCards';
import TableData from './TableData';

const ItemTopViews = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Engagement', href: '/admin/item-views' },
        { title: 'Item Top Views', href: '/admin/top-item-views' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <SummaryCards />

                <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-4 pb-5">
                    <FilterData />
                    <div className="flex w-full justify-end gap-2 md:w-auto">
                        <RefreshButton />
                        <ExportButton endpoint="/top-item-views-summary-export" label="Export Excel" />
                    </div>
                </div>

                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default ItemTopViews;
