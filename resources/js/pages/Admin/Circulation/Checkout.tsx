import { ArrowRightLeft, ArrowUpCircle, Barcode, CheckCircleIcon, LoaderCircleIcon, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import { FormErrorLabel } from '@/components/Input/FormErrorLabel';
import LoadingOnPrefetch from '@/components/Loading/LoadingOnPrefetch';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useTranslation from '@/hooks/use-translation';
import { cn, formatToKhmerDateTime } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import CheckinAndCheckoutLayout from './CheckinAndCheckoutLayout';
import RecentCheckouts from './RecentCheckouts';
import UserCheckoutSearch from './UserCheckoutSearch';

export default function CirculationDesk() {
    const { t } = useTranslation();
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });
    const [refreshKeyRecentCheckout, setRefreshKeyRecentCheckout] = useState(0);

    const [search, setSearch] = useState('');
    const { users_searched } = usePage<any>().props;
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedBarcode, setSelectedBarcode] = useState('');

    const { data, setData, post, processing, transform, progress, errors, clearErrors, reset } = useForm<any>({
        borrower_id: '',
        item_physical_copy_barcode: '',
    });

    useEffect(() => {
        // Check if there is exactly 1 user and their card number matches the search exactly
        if (users_searched?.length === 1) {
            const foundUser = users_searched[0];

            // Match search input against card number (ensuring strings match)
            if (String(foundUser.card_number) === String(search).trim()) {
                setSelectedUser(foundUser);
                // Optionally clear search or focus the next field (barcode) here
            }
        }
    }, [users_searched, search]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, borrower_id: selectedUser?.id, item_physical_copy_barcode: selectedBarcode }));

        post('/admin/circulations', {
            onSuccess: (page: any) => {
                setSelectedUser((prev: any) => ({
                    ...prev,
                    total_active_loan: (prev?.total_active_loan ?? 0) + 1,
                }));
                reset();
                setSelectedBarcode('');
                setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                setRefreshKeyRecentCheckout((prev) => prev + 1);
            },
        });
    };

    return (
        <CheckinAndCheckoutLayout>
            <AlertFlashMessage
                key={flashMessage.message}
                type={flashMessage.type}
                flashMessage={flashMessage.message}
                setFlashMessage={setFlashMessage}
            />
            {/* {errors && <AllErrorsAlert title="Errors" errors={errors} />} */}

            <div className="grid grid-cols-1 gap-7 pt-3 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-4">
                    {/* User SELECTION */}
                    {selectedUser ? (
                        <Card className="relative gap-0 border-primary/50 p-0 shadow-none">
                            <CheckCircleIcon className="pointer-events-none absolute -top-2 -right-2 size-6 bg-background text-primary/80" />
                            <CardContent className="p-3">
                                <div className="relative mb-2 flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-background">
                                        <AvatarImage
                                            src={`/assets/images/users/thumb/${selectedUser.image}`}
                                            className="overflow-hidden rounded"
                                            alt={selectedUser.name}
                                        />
                                        <AvatarFallback className="rounded bg-primary/10 font-semibold text-primary">
                                            {selectedUser.name?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-1">
                                        <a target="_blank" href={`/admin/users/${selectedUser?.id}`} className="group w-fit">
                                            <p className="text-lg leading-none font-semibold text-primary group-hover:underline">
                                                {selectedUser.name}
                                            </p>
                                        </a>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                                            <div className="flex items-center gap-1">
                                                <span className="text-[12px] font-medium text-muted-foreground">{t('Card')}:</span>
                                                <span className="rounded bg-muted px-1.5 text-base font-medium text-foreground">
                                                    {selectedUser.card_number ?? '---'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <span className="text-[12px] font-medium text-muted-foreground">{t('Phone')}: </span>
                                                <span className="text-sm font-medium">{selectedUser.phone ?? '---'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {selectedUser.expired_at && (
                                    <div className="flex items-center justify-between pb-2 text-sm font-medium">
                                        <span className="text-muted-foreground">{t('Account Expires')}: </span>
                                        <span
                                            className={cn(
                                                'transition-colors',
                                                new Date(selectedUser.expired_at) < new Date()
                                                    ? 'text-red-600 dark:text-red-400' // Expired
                                                    : 'text-green-600 dark:text-green-400', // Still active
                                            )}
                                        >
                                            {formatToKhmerDateTime(selectedUser.expired_at, false, true)}
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-2 border-t border-dashed border-primary/50 pt-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[13px]">
                                            <span className="flex items-center gap-1.5 font-medium text-muted-foreground/80">
                                                <ArrowRightLeft className="size-3.5" />
                                                {t('Active Loans')}
                                            </span>
                                            <span className="h-3 w-px bg-border" /> {/* Vertical Separator */}
                                            <span className="font-semibold text-primary">{selectedUser?.total_active_loan ?? 0}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedUser(null);
                                                setSelectedBarcode('');
                                            }}
                                            className="rounded"
                                        >
                                            <X className="size-4" /> {t('Cancel')}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="gap-0 border-primary p-0 shadow-none ring-3 ring-primary/10">
                            <CardHeader className="p-3 pt-5 pb-0">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <User className="size-3.5 text-primary" /> 1. {t('Select Borrower')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 pr-0">
                                <div className="pr-3">
                                    <div className="h-5">
                                        <LoadingOnPrefetch />
                                    </div>
                                    <UserCheckoutSearch onSearch={(search: string) => setSearch(search)} value={selectedUser?.id || ''} />
                                </div>

                                {users_searched?.length > 0 && (
                                    <div className="mt-3 max-h-80 overflow-y-scroll rounded-none bg-muted/20 pr-2.5">
                                        <div className="space-y-2">
                                            {users_searched.map((user: any) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedUser(user)}
                                                    className="group flex cursor-pointer items-center justify-between space-x-4 rounded-md border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-sm"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="size-12 border-muted transition-transform group-hover:scale-105">
                                                            <AvatarImage
                                                                src={`/assets/images/users/thumb/${user.image}`}
                                                                className="size-full overflow-hidden rounded object-cover"
                                                                alt={user.name}
                                                            />
                                                            <AvatarFallback className="rounded bg-primary/10 font-medium text-primary">
                                                                {user.name?.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col gap-0.5">
                                                            {/* Patron Name */}
                                                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                                                                {user.name}{' '}
                                                                {user.phone && <span className="text-xs text-muted-foreground">({user.phone})</span>}
                                                            </p>

                                                            {/* Patron ID / Card Number */}
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[13px] text-muted-foreground">{t('Card')}:</span>
                                                                <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[14px] font-medium text-primary ring-1 ring-foreground/5 ring-inset">
                                                                    {user.card_number ?? '---'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                    {/* ITEM SCANNER */}
                    {selectedUser && (
                        <Card className="gap-0 border-primary p-0 shadow-none ring-3 ring-primary/10">
                            <CardHeader className="p-3 pt-5">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <Barcode className="size-4" /> 2. {t('Check Out')}
                                </CardTitle>
                                <CardDescription>{t('Scan barcode to process Checkout')}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3">
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <Input
                                        autoFocus
                                        placeholder={t('Enter Barcode...')}
                                        className={`dark:border-white/20 dark:focus-within:border-primary ${errors.item_physical_copy_barcode ? 'border-destructive ring-4 ring-destructive/10' : ''} py-6 font-mono text-lg focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20`}
                                        value={selectedBarcode}
                                        onChange={(e) => setSelectedBarcode(e.target.value)}
                                    />
                                    <FormErrorLabel error={errors.item_physical_copy_barcode || errors[0] || errors.borrower_id} />
                                    {/* Checkoute */}
                                    {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                                    <Button disabled={processing} className="h-12 w-full font-semibold" type="submit">
                                        {processing ? (
                                            <span className="mr-2 size-6 animate-spin">
                                                <LoaderCircleIcon />
                                            </span>
                                        ) : (
                                            <span>
                                                <ArrowUpCircle className="mr-2" />
                                            </span>
                                        )}
                                        {t('Check Out')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recent Checkouts PREVIEW */}
                <RecentCheckouts key={refreshKeyRecentCheckout} />
            </div>
        </CheckinAndCheckoutLayout>
    );
}
