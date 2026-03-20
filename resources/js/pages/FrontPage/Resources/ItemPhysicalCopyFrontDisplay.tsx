import TableCellActions from '@/components/Table/TableCellActions';
import TableCellBadge from '@/components/Table/TableCellBadge';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import useTranslation from '@/hooks/use-translation';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

const ItemCopiesTable = ({ copies, showData }: { copies: any[]; showData: any }) => {
    const { t, currentLocale } = useTranslation();

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
                        <TableHeadWithSort label="Barcode" />
                        <TableHeadWithSort label="Call Number" />
                        <TableHeadWithSort label="Item Type" />
                        {/* <TableHeadWithSort label="Library" /> */}
                        {/* <TableHeadWithSort label="Loan Status" /> */}
                        <TableHeadWithSort label="Public Note" />
                    </TableRow>
                </TableHeader>
                <TableBody className="table-body rounded-md">
                    {copies?.map((item: any) => {
                        const status = resolveStatus(item);

                        return (
                            <TableRow className="table-row" key={item.id}>
                                {/* 2. Barcode */}
                                <TableCellText value={item.barcode} className="font-bold text-primary" />

                                <TableCellText value={item.full_call_number ?? '---'} className="font-mono text-xs" />

                                {/* 3. Item Type */}
                                <TableCellText value={item.item_type?.name ?? '---'} />

                                {/* 4. Library (Custom Layout) */}
                                {/* <TableCellActions>
                                    <div className="text-sm font-medium">{item.library?.name ?? '---'}</div>
                                </TableCellActions> */}

                                {/* 7. Computed Status Badge */}
                                {/* <TableCellActions tableCellClassName="px-4">
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
                                </TableCellActions> */}

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

const ItemPhysicalCopyFrontDisplay = () => {
    const { showData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const hasPhysicalCopies = showData?.physical_copies?.length > 0;

    if (!hasPhysicalCopies) return null;
    return (
        <div className="mt-4">
            <div className="flex items-center justify-between pb-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {t('Physical Copies')} ({showData?.physical_copies?.length || 0})
                </h2>
            </div>

            <div className="mb-4 border-l-4 border-amber-400 bg-amber-400/5 px-2 py-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-amber-700 dark:text-amber-200">
                            <span className="mr-2 text-sm font-semibold uppercase">{currentLocale === 'kh' ? 'កត់ចំណាំ' : 'Notice'}:</span>
                            {currentLocale === 'kh' ? 'សូមអញ្ជើញមកបណ្ណាល័យដើម្បីអាន ឬ ខ្ចី។' : 'You can find and borrow it at the library.'}
                        </p>
                    </div>
                </div>
            </div>
            <ItemCopiesTable copies={showData?.physical_copies} showData={showData} />
        </div>
    );
};

export default ItemPhysicalCopyFrontDisplay;
