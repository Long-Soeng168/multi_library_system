import TableCellAvatar from '@/components/Avatar/TableCellAvatar';
import DeleteItemButton from '@/components/Button/DeleteItemButton';
import EditItemButton from '@/components/Button/EditItemButton';
import RecoverItem from '@/components/Button/RecoverItemButton';
import ViewItemButton from '@/components/Button/ViewItemButton';
import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellBadge from '@/components/Table/TableCellBadge';
import TableCellDate from '@/components/Table/TableCellDate';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';

const TableData = () => {
    const hasPermission = usePermission();
    const { tableData, user_library } = usePage<any>().props;
    const { t } = useTranslation();

    /**
     * Resolves the current loan status (Overdue, On Loan, Available)
     */
    const resolveLoanStatus = (item: any) => {
        if (item.due_at) {
            const isOverdue = new Date(item.due_at) < new Date();
            return isOverdue ? { label: 'Overdue', color: 'red' } : { label: 'On Loan', color: 'blue' };
        }
        return { label: 'Available', color: 'green' };
    };

    /**
     * Helper to render consistent badges for Loan Status and Boolean flags
     */
    const renderBadge = (label: string, color: 'red' | 'yellow' | 'green' | 'blue' | 'gray') => {
        const styles = {
            red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
            yellow: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
            green: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
            blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
            gray: 'border-gray-200 bg-gray-50 text-gray-400 dark:border-border dark:bg-transparent',
        };

        return <TableCellBadge value={label} className={cn('rounded-full border px-2 py-0.5 text-[12px] font-semibold', styles[color])} />;
    };

    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort label="Action" />
                            <TableHeadWithSort field="library_id" label="Library" />
                            <TableHeadWithSort field="barcode" label="Barcode" />
                            <TableHeadWithSort field="item_id" label="Title / Barcode" />
                            <TableHeadWithSort field="full_call_number" label="Call Number" />
                            <TableHeadWithSort field="library_id" label="Library" />
                            <TableHeadWithSort field="shelf_location_code" label="Shelf Location" />

                            {/* Main Loan Status */}
                            <TableHeadWithSort field="due_at" label="Loan Status" />
                            {/* Detailed Flags */}
                            <TableHeadWithSort field="not_for_loan" label="Allow Checkout" />
                            <TableHeadWithSort field="item_lost" label="Lost" />
                            <TableHeadWithSort field="damaged" label="Damaged" />
                            <TableHeadWithSort field="withdrawn" label="Withdrawn" />

                            <TableHeadWithSort field="total_checkouts" label="Total Checkouts" />
                            <TableHeadWithSort field="last_borrowed_at" label="Last Borrowed" />
                            <TableHeadWithSort field="last_seen_at" label="Last Seen" />
                            <TableHeadWithSort field="created_by" label="Created by" />
                            <TableHeadWithSort field="updated_by" label="Updated by" />
                        </TableRow>
                    </TableHeader>
                    <TableBody className="table-body rounded-md">
                        {tableData?.data?.map((item: any) => {
                            const currentLoan = resolveLoanStatus(item);

                            return (
                                <TableRow className="table-row" key={item.id}>
                                    <TableCellActions>
                                        {item.deleted_at ? (
                                            <RecoverItem
                                                deleted_at={item.deleted_at}
                                                recoverPath={`/admin/items-physical-copies/${item.id}/recover`}
                                                permission=""
                                            />
                                        ) : (
                                            <div className="flex gap-1">
                                                <EditItemButton
                                                    url={
                                                        hasPermission('item view')
                                                            ? `/admin/items/${item.item?.id}/physical-copies/${item.id}/edit`
                                                            : `/dashboard/library/${user_library?.code}/items/${item.item?.id}/physical-copies/${item.id}/edit`
                                                    }
                                                    permission=""
                                                />
                                                <ViewItemButton
                                                    url={
                                                        hasPermission('item view')
                                                            ? `/admin/items/${item.item?.id}/physical-copies/${item.id}`
                                                            : `/dashboard/library/${user_library?.code}/items/${item.item?.id}/physical-copies/${item.id}`
                                                    }
                                                    permission=""
                                                />
                                                <DeleteItemButton
                                                    deletePath={`/admin/items/${item?.item?.id}/physical-copies/`}
                                                    id={item.barcode}
                                                    permission=""
                                                />
                                            </div>
                                        )}
                                    </TableCellActions>
                                    <TableCellText value={item.library?.name ?? '---'} />
                                    <TableCellText value={item.barcode || '---'} className="font-medium text-primary" />

                                    <TableCell className="py-4">
                                        <div>
                                            <Link href={`/admin/items/${item?.item?.id}`}>
                                                <p className="line-clamp-1 max-w-36 shrink-0 truncate text-sm font-medium whitespace-nowrap text-foreground hover:underline">
                                                    {item?.item?.name}
                                                </p>
                                            </Link>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono whitespace-nowrap text-foreground/80">
                                                    ID: {item?.item?.id}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCellText value={item.full_call_number || '---'} />
                                    <TableCellActions>
                                        <div className="text-sm font-medium">{item.library?.name ?? '---'}</div>
                                        {/* <div className="text-xs text-muted-foreground">
                                            Home: <span className="font-semibold">{item.home_library?.name ?? '---'}</span>
                                        </div> */}
                                    </TableCellActions>
                                    <TableCellActions>
                                        <div className="text-sm font-medium">{item.shelf_location?.name ?? '---'}</div>
                                    </TableCellActions>

                                    {/* Display Current Loan Status (Overdue / On Loan / Available) */}
                                    <TableCell>{renderBadge(t(currentLoan.label), currentLoan.color as any)}</TableCell>

                                    {/* Boolean Flags */}
                                    <TableCell>
                                        {renderBadge(item.not_for_loan === 0 ? 'Yes' : 'No', item.not_for_loan === 0 ? 'green' : 'gray')}
                                    </TableCell>
                                    <TableCell>{renderBadge(item.item_lost ? 'Lost' : 'No', item.item_lost ? 'red' : 'gray')}</TableCell>
                                    <TableCell>{renderBadge(item.damaged ? 'Damaged' : 'No', item.damaged ? 'yellow' : 'gray')}</TableCell>
                                    <TableCell>{renderBadge(item.withdrawn ? 'Withdrawn' : 'No', item.withdrawn ? 'red' : 'gray')}</TableCell>

                                    <TableCellText value={item.total_checkouts} className="font-semibold" />
                                    <TableCellDate value={item.last_borrowed_at} className="whitespace-nowrap" />
                                    <TableCellDate value={item.last_seen_at} className="whitespace-nowrap" />

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <TableCellAvatar
                                                className="size-5"
                                                alt={item.created_user?.name}
                                                image={`/assets/images/users/thumb/${item.created_user?.image}`}
                                            />
                                            <span className="max-w-[150px] truncate">{item.created_user?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <TableCellAvatar
                                                className="size-5"
                                                alt={item.updated_user?.name}
                                                image={`/assets/images/users/thumb/${item.updated_user?.image}`}
                                            />
                                            <span className="max-w-[150px] truncate">{item.updated_user?.name}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            {tableData?.data?.length < 1 && <NoDataDisplay />}
        </>
    );
};

export default TableData;
