import ExportButton from '@/components/Button/ExportButton';
import NewItemButton from '@/components/Button/NewItemButton';
import RefreshButton from '@/components/Button/RefreshButton';
import FilterByLibrary from '@/components/Filter/FilterByLibrary';
import PaginationTabs from '@/components/Pagination/PaginationTabs';
import TableDataSearch from '@/components/Search/TableDataSearch';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeftRightIcon, Banknote, BookOpen, CheckCircle2, History } from 'lucide-react';
import FilterData from './FilterData';
import TableData from './TableData';

const Index = () => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'Circulations',
            href: '/admin/circulations',
        },
    ];

    const { url } = usePage();
    const endpoint = url.split('?')[0];
    const { t } = useTranslation();

    const filters = [
        { label: 'All', value: null, icon: History },
        { label: 'On Loan', value: 'on_loan', icon: BookOpen },
        { label: 'Returned', value: 'returned', icon: CheckCircle2 },
        { label: 'Overdue', value: 'overdue', icon: AlertCircle },
        { label: 'Fine Unpaid', value: 'fine_unpaid', icon: Banknote },
        { label: 'Fine Paid', value: 'fine_paid', icon: Banknote },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <>
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-6 pb-5">
                    <div className="flex w-full gap-2 md:w-auto">
                        {/* Filters specific to loans (Status, Fines, etc.) */}
                        {/* <FilterData /> */}

                        {/* Search by user Name or Barcode */}
                        <TableDataSearch placeholder="Search User or barcode..." />

                        <RefreshButton />
                    </div>

                    <div className="flex w-full justify-end gap-2 md:w-auto">
                        {/* Link to the Circulation Desk (Scanner) */}
                        <ExportButton endpoint="/circulations-export" />
                        <NewItemButton
                            url="/admin/circulations-checkout"
                            icon={ArrowLeftRightIcon}
                            label="Check Out/In"
                            permission="circulation create"
                        />
                    </div>
                </div>

                <FilterByLibrary />
                {/* The updated Table with Timeline and user details */}
                <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 pb-2">
                    <div className="flex space-x-1 rounded border border-border/60 bg-muted/30 p-1.5">
                        {filters.map((filter) => {
                            const isActive = filter.value ? url.includes(`filter_by=${filter.value}`) : !url.includes('filter_by');

                            return (
                                <Link key={filter.label} href={filter.value ? `${endpoint}?filter_by=${filter.value}` : endpoint}>
                                    <button
                                        className={cn(
                                            'group relative flex h-9 cursor-pointer items-center justify-center rounded-xs px-4',
                                            isActive
                                                ? 'bg-white text-primary ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/50'
                                                : 'text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-zinc-800/50',
                                        )}
                                    >
                                        <filter.icon
                                            className={cn(
                                                'mr-2 size-4 transition-transform duration-300 group-hover:scale-110',
                                                isActive ? 'text-primary' : 'text-muted-foreground/60',
                                            )}
                                        />
                                        <span className={cn('text-sm font-semibold transition-colors', isActive ? 'opacity-100' : 'opacity-70')}>
                                            {t(filter.label)}
                                        </span>

                                        {/* Animated Glow Line Indicator */}
                                        {isActive && (
                                            <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-primary" />
                                        )}
                                    </button>
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <TableData />

                {/* Standard Pagination */}
                <div className="py-4">
                    <PaginationTabs />
                </div>
            </>
        </AppLayout>
    );
};

export default Index;
