import UpdateFineStatusButton from '@/components/Button/UpdateFineStatusButton';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useTranslation from '@/hooks/use-translation';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowDownCircle, ArrowDownLeft, ArrowUpRight, ChevronRight, RotateCwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const resolveStatus = (item: any) => {
    if (item.returned_at) return { label: 'Returned', variant: 'outline' as const, className: 'bg-gray-500/10 text-gray-500' };

    if (item.due_at) {
        const isOverdue = new Date(item.due_at) < new Date();
        return isOverdue
            ? { label: 'Overdue', variant: 'destructive' as const }
            : { label: 'On Loan', variant: 'default' as const, className: 'bg-blue-600' };
    }
    return { label: 'Available', variant: 'outline' as const, className: 'text-green-600 border-green-200 bg-green-50' };
};

const RecentCheckins = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Adjust the URL to match your route definition
            const response = await axios.get('/get-recent-checkins');
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch checkins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="lg:col-span-8">
            <Card className="gap-0 py-0 shadow-none">
                <CardHeader className="border-b bg-muted/30 p-4">
                    <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-muted-foreground">
                        <span className="flex items-center gap-2 text-primary">
                            <ArrowDownCircle />
                            {t('Recent Checkins')}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading} className="h-8 w-8">
                                <RotateCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button variant="outline" size="sm" asChild className="rounded">
                                <Link href="/admin/all-circulations">
                                    {t('See More')} <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/10">
                                <TableHead>{t('Barcode')}</TableHead>
                                <TableHead>{t('Title')}</TableHead>
                                <TableHead>{t('Borrower')}</TableHead>
                                <TableHead>{t('Fine')}</TableHead>
                                <TableHead className="text-right">{t('Date')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && items.length === 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse">
                                        <TableCell>
                                            <div className="h-4 w-20 rounded bg-muted" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-48 rounded bg-muted" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-24 rounded bg-muted" />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="ml-auto h-6 w-16 rounded bg-muted" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : items.length > 0 ? (
                                items.map((item) => {
                                    const status = resolveStatus(item);
                                    return (
                                        <TableRow key={item.id} className="whitespace-nowrap transition-colors hover:bg-muted/50">
                                            <TableCell className="font-mono font-bold text-primary">{item.barcode}</TableCell>
                                            <TableCell className="max-w-[200px] text-base hover:underline">
                                                <Link href={`/admin/items/${item.item_id}`} className="line-clamp-1 truncate">
                                                    {item.title}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <Link href={`/admin/users/${item.borrower_id}`} className="group">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="line-clamp-1 max-w-[200px] font-medium group-hover:underline">
                                                            {item.borrower_name}
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-muted-foreground">{t('Card')}:</span>
                                                            <span>{item.borrower_card_number ?? '---'}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <div className="flex flex-col gap-1.5">
                                                    {/* Fine Amount Display */}
                                                    <span
                                                        className={cn(
                                                            'text-sm font-medium',
                                                            item.fine_amount > 0
                                                                ? item.fine_paid
                                                                    ? 'text-green-600'
                                                                    : 'text-destructive'
                                                                : 'text-xs text-muted-foreground',
                                                        )}
                                                    >
                                                        {item.fine_amount > 0 ? `${item.fine_amount.toLocaleString()}` : t('No Fine')}
                                                    </span>

                                                    {/* Status Badge */}
                                                    {item.fine_amount > 0 && (
                                                        <UpdateFineStatusButton
                                                            key={item.fine_paid}
                                                            permission=""
                                                            currentStatus={item.fine_paid}
                                                            updatePath={`/admin/circulations/${item.id}/update-fine-status`}
                                                            status={[
                                                                { label: 'Paid', value: 1 },
                                                                { label: 'Unpaid', value: 0 },
                                                            ]}
                                                            onSuccess={fetchData}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-right whitespace-nowrap">
                                                <div className="flex flex-col items-end font-mono text-sm leading-tight tracking-tighter uppercase">
                                                    {/* Check Out */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">{t('Out')}:</span>
                                                        <span className="text-foreground">{formatToKhmerDateTime(item.borrowed_at, false)}</span>
                                                        <ArrowUpRight className="size-3 text-blue-500/40" />
                                                    </div>

                                                    {/* Short Connector */}
                                                    <div className="mr-[5px] h-1.5 w-px bg-border/60" />

                                                    {/* Due Date (The Deadline) */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">{t('Due')}:</span>
                                                        <span className="font-medium text-muted-foreground/80">
                                                            {formatToKhmerDateTime(item.due_at, false)}
                                                        </span>
                                                        <div className="flex size-3 items-center justify-center">
                                                            <div className="size-1 rounded-full bg-border" />
                                                        </div>
                                                    </div>

                                                    {/* Short Connector (Dashed/Dotted if not returned) */}
                                                    <div
                                                        className={cn('mr-[5px] h-1.5 w-px', item.returned_at ? 'bg-border/60' : 'bg-orange-500/30')}
                                                    />

                                                    {/* Check In */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">{t('In')}:</span>
                                                        <span
                                                            className={cn(
                                                                'font-bold',
                                                                item.returned_at ? 'text-foreground' : 'animate-pulse text-orange-500',
                                                            )}
                                                        >
                                                            {item.returned_at ? formatToKhmerDateTime(item.returned_at, false) : '--- ---'}
                                                        </span>
                                                        <ArrowDownLeft
                                                            className={cn('size-3', item.returned_at ? 'text-green-500/50' : 'text-orange-500')}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        {t('No recent activity found.')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default RecentCheckins;
