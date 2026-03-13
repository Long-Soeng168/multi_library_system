import RefreshButton from '@/components/Button/RefreshButton';
import CRUDItemDialog from '@/components/Dialog/CRUDItemDialog';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PlusIcon } from 'lucide-react';
import Create from './Create';
import TableData from './TableData';

const Index = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        { title: 'Users', href: '/admin/users' },
        {
            title: 'Permissions',
            href: '/admin/permissions',
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
                        {/* Add New Dialog */}
                        <CRUDItemDialog
                            tooltip="Add New Item"
                            dialogTitle="Add New"
                            buttonSize="lg"
                            buttonTitle="Add New"
                            buttonVariant="default"
                            buttonIcon={PlusIcon}
                            buttonClassName='h-11'
                        >
                            <Create />
                        </CRUDItemDialog>
                    </div>
                </div>
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
