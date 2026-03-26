import NewItemButton from '@/components/Button/NewItemButton';
import RefreshButton from '@/components/Button/RefreshButton';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import { Button } from '@/components/ui/button';
import usePermission from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import FilterData from './FilterData';
import TableData from './TableData';

const Index = () => {
    const { user_library } = usePage<any>().props;
    const hasPermission = usePermission();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Subscriptions',
            href: hasPermission('subscription view') ? '/admin/subscriptions' : `/dashboard/library/${user_library?.code}/subscriptions`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-6">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                        <TableDataSearch />
                        <RefreshButton />
                    </div>
                    <div className="flex w-full justify-end md:w-auto">
                        {/* Add New Dialog */}
                        {hasPermission('subscription view') ? (
                            <NewItemButton url={`/admin/subscriptions/create`} permission="subscription create" />
                        ) : (
                            <Link href={`/pricing`}>
                                <Button>Pricing</Button>
                            </Link>
                        )}
                    </div>
                </div>
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
