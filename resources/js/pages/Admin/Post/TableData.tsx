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
                            <TableHeadWithSort field="title" label="Title" />
                            <TableHeadWithSort field="title_kh" label="Title Khmer" />
                            <TableHeadWithSort field="category_code" label="Category Code" />
                            <TableHeadWithSort field="type_code" label="Type" />
                            <TableHeadWithSort field="status" label="Status" />
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
                                            recoverPath={`/admin/posts/${item.id}/recover`}
                                            permission="user update"
                                        />
                                    ) : (
                                        <>
                                            {/* Edit Dialog */}
                                            <EditItemButton url={`/admin/posts/${item.id}/edit`} permission="post update" />

                                            {/* View Dialog */}
                                            <ViewItemButton url={`/admin/posts/${item.id}`} permission="post view" />

                                            {/* Delete Item */}
                                            <DeleteItemButton deletePath="/admin/posts/" id={item.id} permission="post delete" />
                                        </>
                                    )}
                                </TableCellActions>
                                <TableCell>
                                    <TableCellAvatar
                                        className="rounded-none border-none object-contain"
                                        alt={item.title}
                                        image={`/assets/images/posts/thumb/${item.thumbnail}`}
                                    />
                                </TableCell>
                                <TableCellText value={item.title} />
                                <TableCellText value={item.title_kh} />
                                <TableCellText value={item.category_code} />
                                <TableCellText value={item.type?.name} />
                                <TableCellBadge value={item.status} className='capitalize' variant={item.status} />
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
