import DeleteItemButton from '@/components/Button/DeleteItemButton';
import EditItemButton from '@/components/Button/EditItemButton';
import RecoverItem from '@/components/Button/RecoverItemButton';
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
                            <TableHeadWithSort field="type_code" label="Type" />
                            <TableHeadWithSort field="question" label="Question" />
                            <TableHeadWithSort field="question_kh" label="Question Khmer" />
                            <TableHeadWithSort field="order_index" label="Order Index" />
                            <TableHeadWithSort field="answer" label="Answer" />
                            <TableHeadWithSort field="answer_kh" label="Answer Khmer" />
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
                                            recoverPath={`/admin/faqs/${item.id}/recover`}
                                            permission="user update"
                                        />
                                    ) : (
                                        <>
                                            {/* Edit Dialog */}
                                            <EditItemButton url={`/admin/faqs/${item.id}/edit`} permission="faq update" />

                                            {/* View Dialog */}
                                            <ViewItemButton url={`/admin/faqs/${item.id}`} permission="faq view" />

                                            {/* Delete Item */}
                                            <DeleteItemButton deletePath="/admin/faqs/" id={item.id} permission="faq delete" />
                                        </>
                                    )}
                                </TableCellActions>
                                <TableCellText value={item.type_code} />
                                <TableCellText value={item.question} />
                                <TableCellText value={item.question_kh} />
                                <TableCellText value={item.order_index} />
                                <TableCellText value={item.answer} />
                                <TableCellText value={item.answer_kh} />
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
