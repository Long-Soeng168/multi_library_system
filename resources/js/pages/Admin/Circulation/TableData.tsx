import TableCellAvatar from '@/components/Avatar/TableCellAvatar';
import DeleteItemButton from '@/components/Button/DeleteItemButton';
import RecoverItem from '@/components/Button/RecoverItemButton';
import UpdateFineStatusButton from '@/components/Button/UpdateFineStatusButton';
import NoDataDisplay from '@/components/NoDataDisplay';
import TableCellActions from '@/components/Table/TableCellActions';
import TableCellDate from '@/components/Table/TableCellDate';
import TableCellText from '@/components/Table/TableCellText';
import TableHeadWithSort from '@/components/Table/TableHeadWithSort';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import useTranslation from '@/hooks/use-translation';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

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
                            {/* <TableHeadWithSort label="Action" /> */}
                            <TableHeadWithSort label="User" />
                            <TableHeadWithSort label="Title / Barcode" />
                            <TableHeadWithSort field="borrowed_at" label="Timeline (Out/Due/In)" />
                            <TableHeadWithSort field="fine_amount" label="Fine" />
                            <TableHeadWithSort field="created_at" label="Issued by" />
                        </TableRow>
                    </TableHeader>
                    <TableBody className="table-body rounded-md">
                        {tableData?.data?.map((item: any) => (
                            <TableRow className="table-row" key={item.id}>
                                {/* 1. ID */}
                                <TableCellText value={item.id} />
                                <TableCellText value={item.library?.name ?? '---'} />

                                {/* 2. Action */}
                                {/* <TableCellActions>
                                    {item.deleted_at ? (
                                        <RecoverItem
                                            deleted_at={item.deleted_at}
                                            recoverPath={`/admin/circulations/${item.id}/recover`}
                                            permission="circulation update"
                                        />
                                    ) : (
                                        <>
                                            <DeleteItemButton deletePath="/admin/circulations/" id={item.id} permission="circulation delete" />
                                        </>
                                    )}
                                </TableCellActions> */}

                                {/* 3. User */}
                                <TableCell className="min-w-[180px]">
                                    <Link href={`/admin/users/${item.borrower?.id}`} className="group flex items-center gap-3">
                                        <TableCellAvatar alt={item.borrower?.name} image={`/assets/images/users/thumb/${item.borrower?.image}`} />
                                        <div className="flex flex-col">
                                            <span className="line-clamp-1 font-medium text-foreground group-hover:underline">
                                                {item.borrower?.name || 'Unknown User'}
                                            </span>
                                            <span className="mt-0.5 shrink-0 font-semibold whitespace-nowrap text-muted-foreground">
                                                {t('Card')}: {item.borrower?.card_number ?? '---'}
                                            </span>
                                        </div>
                                    </Link>
                                </TableCell>

                                {/* 4. Item / Barcode */}
                                <TableCell className="min-w-[200px]">
                                    <Link href={`/admin/items/${item.item_physical_copy?.item?.id}`} className="group flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="line-clamp-1 font-medium text-foreground group-hover:underline">
                                                {item.item_physical_copy?.item?.name || 'No Title Associated'}
                                            </span>
                                            <div className="mt-0.5 flex items-center gap-2">
                                                <span className="rounded bg-primary/10 px-1 font-mono font-medium text-primary">
                                                    {t('Barcode')}: {item.item_physical_copy?.barcode}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </TableCell>

                                {/* 5. Timeline (Out, Due, In) */}
                                <TableCell className="whitespace-nowrap">
                                    {(() => {
                                        const isPastDue = item.due_at && new Date(item.due_at) < new Date();
                                        const isOverdueAndOut = !item.returned_at && isPastDue;
                                        const isLateAndUnpaid =
                                            item.returned_at && new Date(item.returned_at) > new Date(item.due_at) && !item.fine_paid;

                                        const showWarning = isOverdueAndOut || isLateAndUnpaid;

                                        return (
                                            <div className="flex w-fit flex-col font-mono tracking-tighter uppercase">
                                                {/* Borrowed At */}
                                                <div className="flex items-center gap-2">
                                                    <span className="w-11 text-muted-foreground">{t('Out')}</span>
                                                    <span className="text-foreground">: {formatToKhmerDateTime(item.borrowed_at, false, true)}</span>
                                                    <ArrowUpRight className="size-3 text-blue-500/40" />
                                                </div>

                                                <div className="my-0.5 mr-[5px] h-1.5 w-px self-end bg-border" />

                                                {/* Due At */}
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            'w-11 text-muted-foreground',
                                                            showWarning ? 'font-medium text-destructive' : 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {t('Due')}
                                                    </span>
                                                    <span className={cn('font-medium', showWarning ? 'text-destructive' : 'text-muted-foreground')}>
                                                        : {formatToKhmerDateTime(item.due_at, false, true)}
                                                    </span>
                                                    <div className="flex size-3 items-center justify-center">
                                                        <Clock
                                                            className={cn('size-2.5', showWarning ? 'text-destructive' : 'text-muted-foreground/40')}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="my-0.5 mr-[5px] h-1.5 w-px self-end bg-border" />

                                                {/* Returned At */}
                                                <div className="flex items-center gap-2">
                                                    <span className="w-11 text-muted-foreground">{t('In')}</span>
                                                    <span
                                                        className={cn(
                                                            'font-medium',
                                                            item.returned_at
                                                                ? 'text-green-600'
                                                                : showWarning
                                                                  ? 'text-destructive'
                                                                  : 'animate-pulse text-orange-500',
                                                        )}
                                                    >
                                                        :{' '}
                                                        {formatToKhmerDateTime(item.returned_at, false, true) ??
                                                            (showWarning ? t('On Loan (Overdue)') : t('On Loan'))}
                                                    </span>
                                                    <ArrowDownLeft
                                                        className={cn(
                                                            'size-3',
                                                            item.returned_at
                                                                ? 'text-green-500/40'
                                                                : showWarning
                                                                  ? 'text-destructive'
                                                                  : 'text-orange-500',
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </TableCell>

                                {/* 6. Fine (Amount & Status) */}
                                <TableCell>
                                    <div className="flex flex-col items-start leading-none">
                                        <span
                                            className={cn(
                                                'font-mono font-medium',
                                                parseFloat(item.fine_amount) > 0
                                                    ? item.fine_paid
                                                        ? 'text-green-600'
                                                        : 'text-destructive'
                                                    : 'text-muted-foreground/30',
                                            )}
                                        >
                                            {parseFloat(item.fine_amount) > 0 ? `${item.fine_amount}` : '—'}
                                        </span>
                                        {parseFloat(item.fine_amount) > 0 && (
                                            <UpdateFineStatusButton
                                                key={item.fine_paid}
                                                permission=""
                                                currentStatus={item.fine_paid}
                                                updatePath={`/admin/circulations/${item.id}/update-fine-status`}
                                                status={[
                                                    { label: 'Paid', value: 1 },
                                                    { label: 'Unpaid', value: 0 },
                                                ]}
                                            />
                                        )}
                                    </div>
                                </TableCell>

                                {/* 7. Issued by */}
                                <TableCell>
                                    <span className="flex flex-col gap-0.5 whitespace-nowrap text-muted-foreground">
                                        <p className="font-semibold text-foreground/80">{item.created_user?.name || 'System'}</p>
                                        <TableCellDate className="p-0" value={item.created_at} />
                                    </span>
                                </TableCell>
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
