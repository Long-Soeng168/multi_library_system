import UpdateFineStatusButton from '@/components/Button/UpdateFineStatusButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Clock, CreditCard, Mail, Phone, UserIcon } from 'lucide-react';

const Show = () => {
    const { userData, userCirculations } = usePage<any>().props;
    const { t } = useTranslation();

    const isOverdue = (dueAt: string, returnedAt: string | null) => {
        return !returnedAt && new Date(dueAt) < new Date();
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: userData?.name, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto max-w-6xl space-y-8 p-4">
                {/* 1. MINIMALIST User PROFILE - Dark Mode Compatible */}
                <div className="flex flex-col items-start justify-between gap-8 rounded border bg-card p-4 shadow-none md:flex-row md:items-center">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 rounded shadow-none">
                            <AvatarImage src={`/assets/images/users/thumb/${userData.image}`} alt={userData.name} />
                            <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                                <UserIcon size={36} />
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold text-card-foreground md:text-xl">{userData.name}</h1>
                                {userData.roles?.map((role: any) => (
                                    <Badge key={role.id} variant="secondary" className="rounded">
                                        {role.name}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <CreditCard className="size-3.5 opacity-70" /> {userData.card_number}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail className="size-3.5 opacity-70" /> {userData.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Phone className="size-3.5 opacity-70" /> {userData.phone}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col items-center gap-1 md:w-auto">
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 animate-pulse rounded-full bg-primary" />
                            <p className="text-base font-semibold text-muted-foreground/70">{t('On Loans')}</p>
                        </div>
                        <span className="text-3xl font-semibold text-foreground tabular-nums">{userData.total_active_loan.toLocaleString()}</span>
                    </div>
                </div>

                {/* 2. LOAN HISTORY SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            {t('Loan History')}{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                                ({userCirculations.length} {t('total')})
                            </span>
                        </h2>
                    </div>

                    <Card className="overflow-hidden rounded border-border py-0 shadow-none">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="py-4 font-semibold text-muted-foreground">{t('Title / Barcode')}</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">{t('Timeline (Out/Due/In)')}</TableHead>
                                    <TableHead className="font-semibold text-muted-foreground">{t('Fine')}</TableHead>
                                    <TableHead className="text-right font-semibold text-muted-foreground">{t('Status')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userCirculations.map((item: any) => {
                                    const overdue = isOverdue(item.due_at, item.returned_at);
                                    return (
                                        <TableRow key={item.id} className="group border-border/50">
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <Link href={`/admin/items/${item.item_physical_copy?.item?.id}`}>
                                                        <p className="line-clamp-1 font-medium text-foreground hover:underline">
                                                            {item.item_physical_copy?.item?.name}
                                                        </p>
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono whitespace-nowrap text-foreground/80">
                                                            {t('Barcode')}: {item.item_physical_copy?.barcode}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="">{item.item_physical_copy?.item_type?.name}</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex w-fit shrink-0 flex-col gap-1 font-mono whitespace-nowrap">
                                                    <div className="flex items-center gap-3 text-foreground">
                                                        <span className="w-11 text-muted-foreground">{t('Out')}</span>
                                                        <span className="tabular-nums">: {formatToKhmerDateTime(item.borrowed_at, false, true)}</span>
                                                        <ArrowUpRight className="size-3 opacity-30" />
                                                    </div>
                                                    <div className="flex items-center gap-3 text-muted-foreground">
                                                        <span
                                                            className={cn('w-11', overdue ? 'font-bold text-destructive' : 'text-muted-foreground')}
                                                        >
                                                            {t('Due')}
                                                        </span>
                                                        <span className={cn('tabular-nums', overdue && 'text-destructive')}>
                                                            : {formatToKhmerDateTime(item.due_at, false, true)}
                                                        </span>
                                                        <Clock className={cn('size-3', overdue ? 'animate-pulse text-destructive' : 'opacity-30')} />
                                                    </div>
                                                    {item.returned_at && (
                                                        <div className="mt-1 flex items-center gap-3 border-t border-border pt-1 text-green-500">
                                                            <span className="w-11 text-muted-foreground">{t('In')}</span>
                                                            <span className="font-semibold tabular-nums">
                                                                : {formatToKhmerDateTime(item.returned_at, false, true)}
                                                            </span>
                                                            <ArrowDownLeft className="size-3 opacity-50" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col items-start gap-1">
                                                    <span
                                                        className={cn(
                                                            'font-mono',
                                                            parseFloat(item.fine_amount) > 0
                                                                ? 'font-bold text-destructive'
                                                                : 'text-muted-foreground/30',
                                                            item.fine_paid ? 'text-green-500' : 'text-destructive',
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

                                            <TableCell className="text-right">
                                                {item.returned_at ? (
                                                    <span className="overflow-hidden rounded bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
                                                        {t('Returned')}
                                                    </span>
                                                ) : overdue ? (
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge variant="destructive" className="h-5 overflow-hidden rounded px-2 font-semibold">
                                                            {t('Overdue')}
                                                        </Badge>
                                                        <span className="flex items-center gap-1 font-medium text-destructive">
                                                            <AlertCircle className="size-2.5" /> {t('Action required')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="h-5 overflow-hidden rounded border-primary/30 bg-primary/5 px-2 font-semibold text-primary"
                                                    >
                                                        {t('On Loan')}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Show;
