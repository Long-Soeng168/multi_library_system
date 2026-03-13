import DeleteItemButton from '@/components/Button/DeleteItemButton';
import EditItemButton from '@/components/Button/EditItemButton';
import ViewItemButton from '@/components/Button/ViewItemButton';
import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellDate from '@/components/Table/TableCellDate';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
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
                            <TableHeadWithSort field="name" label="Name" />
                            <TableHeadWithSort field="created_at" label="Created at" />
                            <TableHeadWithSort field="updated_at" label="Updated at" />
                        </TableRow>
                    </TableHeader>
                    <TableBody className="table-body">
                        {tableData?.data?.map((item: any, index: number) => (
                            <TableRow className="table-row" key={item.id}>
                                <TableCellText value={item.id} />
                                <TableCellActions>
                                    {/* Edit Dialog */}
                                    <EditItemButton url={`/admin/roles/${item.id}/edit`} permission="role update" />

                                    {/* View Dialog */}
                                    <ViewItemButton url={`/admin/roles/${item.id}`} permission="role view" />

                                    {/* Delete Item */}
                                    {item.name !== 'Super Admin' && (
                                        <DeleteItemButton deletePath="/admin/roles/" id={item.id} permission="role delete" />
                                    )}
                                </TableCellActions>
                                <TableCellText value={item.name} />
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
