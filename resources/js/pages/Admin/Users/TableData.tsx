import TableCellAvatar from '@/components/Avatar/TableCellAvatar';
import RoleBadge from '@/components/Badge/RoleBadge';
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
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { formatToKhmerDateTime } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';

const TableData = () => {
    const { tableData, user_library } = usePage<any>().props;
    const hasPermission = usePermission();
    const { t, currentLocale } = useTranslation();

    return (
        <>
            <div className="table-data-container">
                <Table>
                    <TableHeader className="table-header">
                        <TableRow>
                            <TableHeadWithSort field="id" label="ID" />
                            <TableHeadWithSort field="library_id" label="Library" />
                            <TableHeadWithSort field="library_role" label="Library Role" />
                            <TableHeadWithSort field="card_number" label="Card Number" />
                            <TableHeadWithSort label="Action" />
                            <TableHeadWithSort label="Image" />
                            <TableHeadWithSort field="title_type_code" label="Honorific" />
                            <TableHeadWithSort field="name" label="Name" />
                            <TableHeadWithSort field="name_kh" label="Name Khmer" />
                            <TableHeadWithSort label="Roles" />
                            <TableHeadWithSort field="email" label="Email" />
                            <TableHeadWithSort field="phone" label="Phone" />
                            <TableHeadWithSort label="Total Resources" />
                            <TableHeadWithSort field="total_active_loan" label="Total Active Loan" />
                            <TableHeadWithSort field="total_checkouts" label="Total Checkouts" />
                            <TableHeadWithSort field="expired_at" label="Expired at" />
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
                                <TableCellText value={item.library_role ?? '---'} />
                                <TableCellText value={item.card_number} />
                                <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem deleted_at={item.deleted_at} recoverPath={`/admin/users/${item.id}/recover`} permission="" />
                                    ) : (
                                        <>
                                            {/* Edit Dialog */}
                                            <EditItemButton
                                                url={
                                                    hasPermission('item view')
                                                        ? `/admin/users/${item.id}/edit`
                                                        : `/dashboard/library/${user_library?.code}/users/${item.id}/edit`
                                                }
                                                permission=""
                                            />

                                            {/* View Dialog */}
                                            <ViewItemButton
                                                url={
                                                    hasPermission('item view')
                                                        ? `/admin/users/${item.id}`
                                                        : `/dashboard/library/${user_library?.code}/users/${item.id}`
                                                }
                                                permission=""
                                            />

                                            {/* Delete Item */}
                                            {!item.roles.some((role: { name: string }) => role.name === 'Super Admin') ||
                                                (item?.library_role != 'owner' && (
                                                    <DeleteItemButton deletePath="/admin/users/" id={item.id} permission="" />
                                                ))}
                                        </>
                                    )}
                                </TableCellActions>
                                <TableCell>
                                    <TableCellAvatar alt={item.name} image={`/assets/images/users/thumb/${item.image}`} />
                                </TableCell>
                                <TableCellText value={item.title?.name} />
                                <TableCellText value={item.name} />
                                <TableCellText value={item.name_kh} />
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.roles?.length > 0 && item.roles?.map((item: any) => <RoleBadge key={item.id} title={item.name} />)}
                                    </div>
                                </TableCell>
                                <TableCellText value={item.email} />
                                <TableCellText value={item.phone} />
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.author_items_count > 0 && (
                                            <Link href={`/admin/items?author_id=${item.id}`}>
                                                <Badge variant="outline" className="rounded hover:underline">
                                                    {t('Author Items')}: {item.author_items_count}
                                                </Badge>
                                            </Link>
                                        )}
                                        {item.publisher_items_count > 0 && (
                                            <Link href={`/admin/items?publisher_id=${item.id}`}>
                                                <Badge variant="outline" className="rounded hover:underline">
                                                    {t('Publisher Items')}: {item.publisher_items_count}
                                                </Badge>
                                            </Link>
                                        )}
                                        {item.advisor_items_count > 0 && (
                                            <Link href={`/admin/items?advisor_id=${item.id}`}>
                                                <Badge variant="outline" className="rounded hover:underline">
                                                    {t('Advisor Items')}: {item.advisor_items_count}
                                                </Badge>
                                            </Link>
                                        )}
                                        {item.posts_count > 0 && (
                                            <Link href={`/admin/posts?created_by=${item.id}`}>
                                                <Badge variant="outline" className="rounded hover:underline">
                                                    {t('User Posts')}: {item.posts_count}
                                                </Badge>
                                            </Link>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCellText value={item.total_active_loan} />
                                <TableCellText value={item.total_checkouts} />
                                <TableCellText
                                    value={formatToKhmerDateTime(item.expired_at, false, true)}
                                    className={`font-semibold ${!item.expired_at ? '' : new Date(item.expired_at) < new Date() ? 'text-red-600' : 'text-green-600'} `}
                                />
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
