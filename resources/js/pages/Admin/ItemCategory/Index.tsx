import CategoryBreadcrumb from '@/components/Breadcrumb/CategoryBreadcrumb';
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
import FilterMainCategory from '../Item/FilterMainCategory';
import FilterData from './FilterData';
import TableData from './TableData';

const Index = () => {
    const { user_library, user_active_plan } = usePage<any>().props;
    const hasPermission = usePermission();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Items',
            href: hasPermission('item view') ? '/admin/items' : `/dashboard/library/${user_library?.code}/items`,
        },
        {
            title: 'Categories',
            href: hasPermission('item view') ? '/admin/item-categories' : `/dashboard/library/${user_library?.code}/item-categories'`,
        },
    ];
    const { filteredCategory, main_category_code } = usePage<any>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <LibraryStatusCard />
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-6">
                    <div className="flex w-full gap-2 md:w-auto">
                        <FilterData />
                        <TableDataSearch />
                        <RefreshButton />
                        {/* <HelpDialog /> */}
                    </div>
                    <div className="flex w-full justify-end md:w-auto">
                        {/* Add New Dialog */}
                        <>
                            {(hasPermission('item view') || user_library?.status == 'active') && (
                                <NewItemButton
                                    url={`/admin/item-categories/create?${filteredCategory?.id ? 'filtered_category_id=' + filteredCategory?.id : ''}&${main_category_code ? 'main_category_code=' + main_category_code : ''}`}
                                    permission=""
                                />
                            )}
                        </>
                    </div>
                </div>
                <FilterByLibrary />
                <FilterMainCategory />
                {hasPermission('item view') && <CategoryBreadcrumb path="/admin/item-categories" />}
                <TableData />
                <PaginationTabs />
            </>
        </AppLayout>
    );
};

export default Index;
