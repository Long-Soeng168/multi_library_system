import DeleteItemButton from '@/components/Button/DeleteItemButton';
import EditItemButton from '@/components/Button/EditItemButton';
import RecoverItem from '@/components/Button/RecoverItemButton';
import ViewItemButton from '@/components/Button/ViewItemButton';
import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellDate from '@/components/Table/TableCellDate';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData } = usePage<any>().props;
    const getStatusBadge = (status: string) => {
        const base = 'px-2 py-1 text-xs font-medium rounded-full';

        switch (status) {
            case 'active':
                return `${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300`;
            case 'pending':
                return `${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300`;
            case 'expired':
                return `${base} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300`;
            case 'canceled':
                return `${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300`;
            default:
                return `${base} bg-muted text-muted-foreground`;
        }
    };
    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort field="id" label="ID" />
                            <TableHeadWithSort label="Action" />

                            <TableHeadWithSort field="library" label="Library" />
                            <TableHeadWithSort field="plan" label="Plan" />
                            <TableHeadWithSort field="status" label="Status" />

                            <TableHeadWithSort field="started_at" label="Started Date" />
                            <TableHeadWithSort field="expires_at" label="Expires Date" />

                            <TableHeadWithSort field="created_at" label="Created at" />
                            <TableHeadWithSort field="created_by" label="Created by" />
                            <TableHeadWithSort field="updated_at" label="Updated at" />
                            <TableHeadWithSort field="updated_by" label="Updated by" />
                        </TableRow>
                    </TableHeader>

                    <TableBody className="table-body rounded-md">
                        {tableData?.data?.map((item: any) => (
                            <TableRow className="table-row" key={item.id}>
                                <TableCellText value={item.id} />

                                {/* Actions */}
                                <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem
                                            deleted_at={item.deleted_at}
                                            recoverPath={`/admin/subscriptions/${item.id}/recover`}
                                            permission="subscription update"
                                        />
                                    ) : (
                                        <>
                                            <EditItemButton url={`/admin/subscriptions/${item.id}/edit`} permission="subscription update" />

                                            <ViewItemButton url={`/admin/subscriptions/${item.id}`} permission="subscription view" />

                                            <DeleteItemButton deletePath="/admin/subscriptions/" id={item.id} permission="subscription delete" />
                                        </>
                                    )}
                                </TableCellActions>

                                {/* Relations */}
                                <TableCellText value={item.library?.name} />
                                <TableCellText value={item.plan?.name} />

                                {/* Status */}
                                <TableCell>
                                    <span className={cn('uppercase', getStatusBadge(item.status))}>{item.status}</span>
                                </TableCell>

                                {/* Dates */}
                                <TableCellDate value={item.started_at} />
                                <TableCellDate value={item.expires_at} />

                                {/* Audit */}
                                <TableCellDate value={item.created_at} />
                                <TableCellText value={item.created_user?.name} />
                                <TableCellDate value={item.updated_at} />
                                <TableCellText value={item.updated_user?.name} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {tableData?.data?.length < 1 && <NoDataDisplay />}
        </>
    );
};

export default TableData;
