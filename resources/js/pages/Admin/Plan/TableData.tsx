import DeleteItemButton from '@/components/Button/DeleteItemButton';
import EditItemButton from '@/components/Button/EditItemButton';
import RecoverItem from '@/components/Button/RecoverItemButton';
import ViewItemButton from '@/components/Button/ViewItemButton';
import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellDate from '@/components/Table/TableCellDate';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData } = usePage<any>().props;

    const renderLimit = (value: number) => {
        return value === -1 ? 'Unlimited' : value;
    };

    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort field="id" label="ID" />
                            <TableHeadWithSort label="Action" />
                            <TableHeadWithSort field="name" label="Name" />
                            <TableHeadWithSort field="name_kh" label="Name Khmer" />
                            <TableHeadWithSort field="price" label="Price" />
                            <TableHeadWithSort field="billing_cycle" label="Billing" />
                            <TableHeadWithSort label="Limits" />
                            <TableHeadWithSort field="is_popular" label="Popular" />
                            <TableHeadWithSort field="order_index" label="Order" />
                            <TableHeadWithSort field="created_at" label="Created" />
                            <TableHeadWithSort field="updated_at" label="Updated" />
                        </TableRow>
                    </TableHeader>

                    <TableBody className="table-body rounded-md">
                        {tableData?.data?.map((item: any) => (
                            <TableRow className="table-row" key={item.id}>
                                {/* ID */}
                                <TableCellText value={item.id} />

                                {/* Actions */}
                                <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem
                                            deleted_at={item.deleted_at}
                                            recoverPath={`/admin/plans/${item.id}/recover`}
                                            permission="plan update"
                                        />
                                    ) : (
                                        <>
                                            <EditItemButton url={`/admin/plans/${item.id}/edit`} permission="plan update" />
                                            <ViewItemButton url={`/admin/plans/${item.id}`} permission="plan view" />
                                            <DeleteItemButton deletePath="/admin/plans/" id={item.id} permission="plan delete" />
                                        </>
                                    )}
                                </TableCellActions>

                                {/* Name */}
                                <TableCellText value={item.name} />
                                <TableCellText value={item.name_kh} />

                                {/* Price */}
                                <TableCell>{item.price === 0 ? <Badge variant="secondary">Free</Badge> : <span>${item.price}</span>}</TableCell>

                                {/* Billing */}
                                <TableCellText value={item.billing_cycle || '-'} />

                                {/* Limits */}
                                <TableCell>
                                    <div className="flex flex-col shrink-0 whitespace-nowrap text-xs">
                                        <span>📚 Books: {renderLimit(item.max_books)}</span>
                                        <span>👥 Members: {renderLimit(item.max_members)}</span>
                                        {/* <span>💾 Storage: {renderLimit(item.max_storage_mb)} MB</span> */}
                                    </div>
                                </TableCell>

                                {/* Popular */}
                                <TableCell>{item.is_popular ? <Badge className="bg-yellow-500 text-white">Popular</Badge> : '-'}</TableCell>

                                {/* Order */}
                                <TableCellText value={item.order_index} />

                                {/* Dates */}
                                <TableCellDate value={item.created_at} />
                                <TableCellDate value={item.updated_at} />
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
