import DeleteItemButton from '@/components/Button/DeleteItemButton';
import CRUDItemDialog from '@/components/Dialog/CRUDItemDialog';
import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellDate from '@/components/Table/TableCellDate';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { usePage } from '@inertiajs/react';
import { EditIcon, ViewIcon } from 'lucide-react';
import Create from './Create';

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
                                    <CRUDItemDialog
                                        permission="permission update"
                                        tooltip="Edit Item"
                                        dialogTitle="Edit"
                                        buttonClassName="text-primary shadow-none"
                                        buttonIcon={EditIcon}
                                    >
                                        <Create editData={item} />
                                    </CRUDItemDialog>

                                    {/* View Dialog */}
                                    <CRUDItemDialog
                                        permission="permission update"
                                        tooltip="View Item"
                                        dialogTitle="View"
                                        buttonClassName="shadow-none"
                                        buttonIcon={ViewIcon}
                                    >
                                        <Create editData={item} readOnly={true} />
                                    </CRUDItemDialog>

                                    {/* Delete Item */}
                                    <DeleteItemButton deletePath="/admin/permissions/" id={item.id} permission="permission delete" />
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
