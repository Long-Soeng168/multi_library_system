import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellBadge from '@/components/Table/TableCellBadge';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Link, usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData } = usePage<any>().props;

    return (
        <>
            <div className="table-data-container">
                <Table>
                    <Table>
                        <TableHeader className="table-header">
                            <TableRow>
                                <TableHeadWithSort field="item_id" label="ID / Title" />
                                <TableHeadWithSort label="Main Category" />
                                <TableHeadWithSort label="Category" />
                                <TableHeadWithSort field="total_views" label="Total Views" />
                            </TableRow>
                        </TableHeader>

                        <TableBody className="table-body rounded-md">
                            {tableData?.data?.map((row: any) => (
                                <TableRow className="table-row" key={row.item_id}>
                                    <TableCell className="min-w-[200px]">
                                        <Link href={`/admin/items/${row.item?.id}`} className="group flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="line-clamp-1 font-medium text-foreground group-hover:underline">
                                                    {row.item?.name || `Item #${row.item_id} (Deleted)`}
                                                </span>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                    <span className="rounded bg-primary/10 px-1 font-mono font-medium text-primary">
                                                        ID: {row.item_id}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCellText value={row.item?.main_category_code || '-'} />
                                    <TableCellText value={row.item?.category?.name || '-'} />
                                    <TableCellBadge value={row.total_views ?? 0} variant="default" />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Table>
            </div>

            {tableData?.data?.length < 1 && <NoDataDisplay />}
        </>
    );
};

export default TableData;
