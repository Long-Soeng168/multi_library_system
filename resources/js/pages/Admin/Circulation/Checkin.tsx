import { ArrowDownCircle, Barcode, LoaderCircleIcon } from 'lucide-react';
import React, { useState } from 'react';

import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import { FormErrorLabel } from '@/components/Input/FormErrorLabel';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useTranslation from '@/hooks/use-translation';
import { useForm } from '@inertiajs/react';
import CheckinAndCheckoutLayout from './CheckinAndCheckoutLayout';
import RecentCheckins from './RecentCheckins';

export default function CirculationDesk() {
    const { t } = useTranslation();
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });
    const [refreshKeyRecentCheckin, setRefreshKeyRecentCheckin] = useState(0);

    const [selectedBarcode, setSelectedBarcode] = useState('');

    const { data, setData, post, processing, transform, progress, errors, clearErrors, reset } = useForm<any>({
        borrower_id: '',
        item_physical_copy_barcode: '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, item_physical_copy_barcode: selectedBarcode }));

        post('/admin/circulations/checkin', {
            onSuccess: (page: any) => {
                reset();
                setSelectedBarcode('');
                setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                setRefreshKeyRecentCheckin((prev) => prev + 1);

                console.log(page.props.flash?.borrower);
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

                    <Card className="gap-0 border-primary p-0 shadow-none ring-3 ring-primary/10">
                        <CardHeader className="p-3 pt-5">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                                <Barcode className="size-4" /> {t('Check In')}
                            </CardTitle>
                            <CardDescription>{t('Scan barcode to process Checkin')}</CardDescription>
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
                                <FormErrorLabel error={errors.item_physical_copy_barcode || errors[0]} />

                                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                                <Button disabled={processing} className="h-12 w-full font-semibold" type="submit">
                                    {processing ? (
                                        <span className="mr-2 size-6 animate-spin">
                                            <LoaderCircleIcon />
                                        </span>
                                    ) : (
                                        <span>
                                            <ArrowDownCircle className="mr-2" />
                                        </span>
                                    )}
                                    {t('Check In')}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <RecentCheckins key={refreshKeyRecentCheckin} />
            </div>
        </CheckinAndCheckoutLayout>
    );
}
