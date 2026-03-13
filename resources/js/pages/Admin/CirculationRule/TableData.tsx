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
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData } = usePage<any>().props;
    const { t } = useTranslation();

    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort field="id" label="ID" />
                            <TableHeadWithSort field="library_id" label="Library" />
                            <TableHeadWithSort label="Action" />
                            <TableHeadWithSort field="fine_amount_per_day" label="Fine/Day" />
                            <TableHeadWithSort field="max_fines_amount" label="Max Fine" />
                            <TableHeadWithSort field="borrowing_limit" label="Limit" />
                            <TableHeadWithSort field="loan_period" label="Period (Days)" />
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
                                <TableCellText value={item.library?.name ?? '---'} />
                                <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem
                                            deleted_at={item.deleted_at}
                                            recoverPath={`/admin/circulation-rules/${item.id}/recover`}
                                            permission="circulation update"
                                        />
                                    ) : (
                                        <>
                                            <EditItemButton url={`/admin/circulation-rules/${item.id}/edit`} permission="circulation update" />
                                            <ViewItemButton url={`/admin/circulation-rules/${item.id}`} permission="circulation view" />
                                            <DeleteItemButton deletePath="/admin/circulation-rules/" id={item.id} permission="circulation delete" />
                                        </>
                                    )}
                                </TableCellActions>

                                {/* Numeric Rules Formatting */}
                                <TableCellText
                                    value={Number(item.fine_amount_per_day).toLocaleString()}
                                    className="font-mono font-bold text-primary"
                                />
                                <TableCellText value={Number(item.max_fines_amount).toLocaleString()} className="font-mono" />
                                <TableCellText value={item.borrowing_limit} />
                                <TableCellText value={`${item.loan_period} ${t('Days')}`} />

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
