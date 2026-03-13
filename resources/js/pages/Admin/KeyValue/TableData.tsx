import TableCellAvatar from '@/components/Avatar/TableCellAvatar';
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
import { usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData } = usePage<any>().props;
    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort field="id" label="ID" />
                            <TableHeadWithSort label="Action" />
                            <TableHeadWithSort label="Image" />
                            <TableHeadWithSort field="type_code" label="Type" />
                            <TableHeadWithSort field="value" label="Value" />
                            <TableHeadWithSort field="name" label="Name" />
                            <TableHeadWithSort field="name_kh" label="Name Khmer" />
                            <TableHeadWithSort field="order_index" label="Order Index" />
                            <TableHeadWithSort field="short_description" label="Short Description" />
                            <TableHeadWithSort field="short_description_kh" label="Short Description Khmer" />
                            <TableHeadWithSort field="created_at" label="Created at" />
                            <TableHeadWithSort field="created_by" label="Created by" />
                            <TableHeadWithSort field="updated_at" label="Updated at" />
                            <TableHeadWithSort field="updated_by" label="Updated by" />
                        </TableRow>
                    </TableHeader>
                    <TableBody className="table-body rounded-md">
                        {tableData?.data?.map((item: any, index: number) => (
                            <TableRow className="table-row" key={item.id}>
                                <TableCellText value={item.id} />
                                <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem
                                            deleted_at={item.deleted_at}
                                            recoverPath={`/admin/key-values/${item.id}/recover`}
                                            permission="user update"
                                        />
                                    ) : (
                                        <>
                                            {/* Edit Dialog */}
                                            <EditItemButton url={`/admin/key-values/${item.id}/edit`} permission="key_value update" />

                                            {/* View Dialog */}
                                            <ViewItemButton url={`/admin/key-values/${item.id}`} permission="key_value view" />

                                            {/* Delete Item */}
                                            <DeleteItemButton deletePath="/admin/key-values/" id={item.id} permission="key_value delete" />
                                        </>
                                    )}
                                </TableCellActions>
                                <TableCell>
                                    <TableCellAvatar
                                        className="rounded-none border-none object-contain"
                                        alt={item.name}
                                        image={`/assets/images/key_values/thumb/${item.image}`}
                                    />
                                </TableCell>
                                <TableCellText value={item.type_code} />
                                <TableCellText value={item.value} />
                                <TableCellText value={item.name} />
                                <TableCellText value={item.name_kh} />
                                <TableCellText value={item.order_index} />
                                <TableCellText value={item.short_description} />
                                <TableCellText value={item.short_description_kh} />
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
