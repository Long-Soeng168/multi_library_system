import DeleteItemButton from '@/components/Button/DeleteItemButton';
import NewItemButton from '@/components/Button/NewItemButton';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellBadge from '@/components/Table/TableCellBadge';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { EditIcon } from 'lucide-react';

const ItemCopiesTable = ({ copies, showData }: { copies: any[]; showData: any }) => {
    const { t, currentLocale } = useTranslation();
    const { user_library, auth } = usePage<any>().props;
    const hasPermission = usePermission();
    /**
     * Resolves the current status based on Koha flags and circulation dates
     */
    const resolveStatus = (copy: any) => {
        if (copy.due_at) {
            const isOverdue = new Date(copy.due_at) < new Date();
            return isOverdue ? { label: 'Overdue', label_kh: 'ហួសកំណត់' } : { label: 'On Loan', label_kh: 'បានខ្ចីចេញ' };
        }
        if (copy.not_for_loan != 0) return { label: 'Not for Loan', label_kh: 'មិនសម្រាប់ខ្ចី' };

        return { label: 'Available', label_kh: 'មាននៅបណ្ណាល័យ' };
    };

    return (
        <div className="w-full overflow-x-auto bg-background">
            <Table>
                <TableHeader className="table-header">
                    <TableRow>
                        <TableHeadWithSort label="Action" />
                        <TableHeadWithSort label="Barcode" />
                        <TableHeadWithSort label="Item Type" />
                        <TableHeadWithSort label="Library" />
                        <TableHeadWithSort label="Location" />
                        <TableHeadWithSort label="Call Number" />
                        <TableHeadWithSort label="Loan Status" />
                        <TableHeadWithSort label="Unpublic Note" />
                        <TableHeadWithSort label="Public Note" />
                    </TableRow>
                </TableHeader>
                <TableBody className="table-body rounded-md">
                    {copies?.map((item: any) => {
                        const status = resolveStatus(item);

                        return (
                            <TableRow className="table-row" key={item.id}>
                                {/* 1. Actions (Front) */}
                                <TableCellActions>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={
                                                hasPermission('item view')
                                                    ? `/admin/items/${showData?.id}/physical-copies/${item.id}/edit`
                                                    : `/dashboard/library/${user_library?.code}/items/${showData?.id}/physical-copies/${item.id}/edit`
                                            }
                                        >
                                            <Button variant="outline" size="sm" className="h-8 rounded">
                                                <EditIcon className="mr-1 size-3.5" /> {t('Edit')}
                                            </Button>
                                        </Link>
                                        <DeleteItemButton
                                            deletePath={`/admin/items/${showData?.id}/physical-copies/`}
                                            id={item.barcode}
                                            permission="item delete"
                                        />
                                    </div>
                                </TableCellActions>

                                {/* 2. Barcode */}
                                <TableCellText value={item.barcode} className="font-bold text-primary" />

                                {/* 3. Item Type */}
                                <TableCellText value={item.item_type?.name ?? '---'} />

                                {/* 4. Library (Custom Layout) */}
                                <TableCellActions>
                                    <div className="text-sm font-medium">{item.library?.name ?? '---'}</div>
                                    {/* {item.home_library_code !== item.current_library_code && (
                                        <div className="text-[9px] font-bold text-orange-600 uppercase dark:text-orange-400">
                                            Home: {item.home_library?.name ?? '---'}
                                        </div>
                                    )} */}
                                </TableCellActions>

                                {/* 5. Location */}
                                <TableCellText value={item.shelf_location_code ?? '---'} />

                                {/* 6. Call Number */}
                                <TableCellText value={item.full_call_number ?? '---'} className="font-mono text-xs" />

                                {/* 7. Computed Status Badge */}
                                <TableCellActions tableCellClassName="px-4">
                                    <div className="flex flex-col gap-1">
                                        <TableCellBadge
                                            value={currentLocale === 'kh' ? status.label_kh : status.label}
                                            className={cn(
                                                'rounded-full border px-2 py-0.5 text-[12px] font-semibold',
                                                // Simple logic based on the label
                                                status.label === 'Overdue' &&
                                                    'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-500',
                                                status.label === 'On Loan' &&
                                                    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400',
                                                status.label === 'Not for Loan' &&
                                                    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
                                                status.label === 'Available' &&
                                                    'border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400',
                                            )}
                                        />
                                        {item.due_at && (
                                            <span
                                                className={cn(
                                                    'text-[12px] font-medium text-foreground',
                                                    status.label === 'Overdue' && 'text-red-700 dark:text-red-500',
                                                )}
                                            >
                                                {t('Due')}: {formatToKhmerDateTime(item.due_at, false, true)}
                                            </span>
                                        )}
                                    </div>
                                </TableCellActions>

                                {/* 8. Notes (Staff) */}
                                <TableCellText value={item.unpublic_note || '---'} className="line-clamp-2 max-w-[150px] text-xs" />

                                {/* 9. Notes (Public) */}
                                <TableCellText value={item.public_note || '---'} className="line-clamp-2 max-w-[150px] text-xs" />
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

const ItemPhysicalCopy = () => {
    const { showData, user_library, auth } = usePage<any>().props;
    const hasPermission = usePermission();
    const { t, currentLocale } = useTranslation();

    return (
        <div className="mt-4">
            <div className="mb-4 flex items-center justify-between pb-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {t('Physical Copies')} ({showData?.physical_copies?.length || 0})
                </h2>
                <NewItemButton
                    url={
                        hasPermission('item view')
                            ? `/admin/items/${showData?.id}/physical-copies/create`
                            : `/dashboard/library/${user_library?.code}/items/${showData?.id}/physical-copies/create`
                    }
                    permission=""
                />
            </div>

            <ItemCopiesTable copies={showData?.physical_copies} showData={showData} />
        </div>
    );
};

export default ItemPhysicalCopy;
