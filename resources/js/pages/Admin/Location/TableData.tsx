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
import usePermission from '@/hooks/use-permission';
import { usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData, user_library } = usePage<any>().props;
    const hasPermission = usePermission();
    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort field="id" label="ID" />
                            <TableHeadWithSort field="library_id" label="Library" />
                            <TableHeadWithSort label="Action" />
                            <TableHeadWithSort label="Image" />
                            <TableHeadWithSort field="name" label="Name" />
                            <TableHeadWithSort field="name_kh" label="Name Khmer" />
                            <TableHeadWithSort field="order_index" label="Order Index" />
                            <TableHeadWithSort field="type_code" label="Type" />
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
                                <TableCellText value={item.library?.name ?? '---'} />
                                <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem deleted_at={item.deleted_at} recoverPath={`/admin/locations/${item.id}/recover`} permission="" />
                                    ) : (
                                        <>
                                            {/* Edit Dialog */}
                                            <EditItemButton
                                                url={
                                                    hasPermission('item view')
                                                        ? `/admin/locations/${item.id}/edit`
                                                        : `/dashboard/library/${user_library?.code}/shelf-locations/${item.id}/edit`
                                                }
                                                permission=""
                                            />

                                            {/* View Dialog */}
                                            <ViewItemButton
                                                url={
                                                    hasPermission('item view')
                                                        ? `/admin/locations/${item.id}`
                                                        : `/dashboard/library/${user_library?.code}/shelf-locations/${item.id}`
                                                }
                                                permission=""
                                            />

                                            {/* Delete Item */}
                                            <DeleteItemButton deletePath="/admin/locations/" id={item.id} permission="" />
                                        </>
                                    )}
                                </TableCellActions>
                                <TableCell>
                                    <TableCellAvatar
                                        className="rounded-none border-none"
                                        imageClassName="object-contain"
                                        alt={item.name}
                                        image={`/assets/images/locations/thumb/${item.image}`}
                                    />
                                </TableCell>
                                <TableCellText value={item.name} />
                                <TableCellText value={item.name_kh} />
                                <TableCellText value={item.order_index} />
                                <TableCellText value={item.type_code} />
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
