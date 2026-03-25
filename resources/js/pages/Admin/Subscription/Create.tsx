import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import { FormCombobox } from '@/components/Input/FormCombobox';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionForm {
    library_id: string;
    plan_id: string;
    status: 'active' | 'pending' | 'expired' | 'canceled';
    started_at?: string;
    expires_at?: string;
    payment_proof_image?: string | null;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const { libraries, plans, selected_plan, selected_library } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    const [paymentImageFiles, setPaymentImageFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, errors, reset, transform } = useForm<SubscriptionForm>({
        library_id: editData?.library_id || selected_library?.id || '',
        plan_id: editData?.plan_id || selected_plan?.id || '',
        status: editData?.status || 'pending',
        started_at: editData?.started_at || '',
        expires_at: editData?.expires_at || '',
        payment_proof_image: editData?.payment_proof_image || null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, payment_proof_image: paymentImageFiles ? paymentImageFiles[0] : null }));

        if (editData?.id) {
            post(`/admin/subscriptions/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setPaymentImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/subscriptions', {
                onSuccess: (page: any) => {
                    reset();
                    setPaymentImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Subscriptions', href: '/admin/subscriptions' },
        { title: editData?.id ? 'Edit' : 'Create', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={onSubmit} className="form">
                <AlertFlashMessage
                    key={flashMessage.message}
                    type={flashMessage.type}
                    flashMessage={flashMessage.message}
                    setFlashMessage={setFlashMessage}
                />

                {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}
                {selected_plan?.id && (
                    <div
                        key={selected_plan?.id}
                        className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:shadow-md ${
                            selected_plan?.is_popular === 1
                                ? 'border-primary bg-card shadow-lg ring-2 ring-primary/10'
                                : 'border-border bg-card shadow-sm'
                        }`}
                    >
                        {/* Popular Badge */}
                        {selected_plan?.is_popular === 1 && (
                            <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-primary-foreground uppercase shadow-sm">
                                {t('Popular')}
                            </div>
                        )}

                        {/* Header Section */}
                        <div className="mb-8 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold tracking-tight text-foreground">
                                    {currentLocale === 'kh' && selected_plan?.name_kh ? selected_plan.name_kh : selected_plan?.name}
                                </h3>
                                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {selected_plan?.billing_cycle_label}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black tracking-tighter text-foreground">
                                    {Number(selected_plan?.price) === 0 ? t('Free') : `$${Number(selected_plan?.price).toFixed(0)}`}
                                </span>
                            </div>
                        </div>

                        {/* Admin Quick Stats - Grid with internal dividers */}
                        <div className="mt-auto overflow-hidden rounded-xl border border-border/50 bg-muted/30">
                            <div className="grid grid-cols-2 divide-x divide-border/50">
                                <div className="flex flex-col items-center p-3 text-center">
                                    <span className="mb-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase">{t('Books')}</span>
                                    <span className="text-base font-bold text-foreground">
                                        {selected_plan?.max_books === -1 ? '∞' : selected_plan?.max_books}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-3 text-center">
                                    <span className="mb-1 text-[10px] font-bold tracking-tight text-muted-foreground uppercase">{t('Members')}</span>
                                    <span className="text-base font-bold text-foreground">
                                        {selected_plan?.max_members === -1 ? '∞' : selected_plan?.max_members}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* LEFT: QR SECTION */}
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">
                        <p className="mb-3 text-sm font-medium text-gray-500 dark:text-zinc-400">Scan to Pay</p>

                        {/* Added a subtle white padding around the QR in dark mode to ensure scanners can read it against dark backgrounds */}
                        <div className="rounded-xl bg-white shadow-md dark:ring-1 dark:ring-zinc-800">
                            <img className="w-[160px] rounded-lg object-cover" src="/assets/payment_qr.jpg" alt="Payment QR" />
                        </div>

                        <a
                            href="/assets/payment_qr.jpg"
                            download
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                        >
                            <DownloadIcon className="h-4 w-4" /> Download QR
                        </a>
                    </div>

                    {/* RIGHT: UPLOAD SECTION */}
                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="dark:brightness-90 dark:contrast-125">
                            <FormFileUpload
                                error={errors?.payment_proof_image}
                                id="payment_proof_image"
                                label="Payment Proof Image"
                                files={paymentImageFiles}
                                setFiles={setPaymentImageFiles}
                            />
                        </div>

                        {editData?.payment_proof_image && (
                            <div className="mt-4 flex flex-col items-start gap-1">
                                <b>Uploaded Payment Proof</b>
                                <a href={`/assets/images/subscriptions/${editData?.payment_proof_image}`} target="_blank">
                                    <img
                                        className="max-w-[100px] rounded-md duration-300 hover:scale-105"
                                        src={`/assets/images/subscriptions/${editData?.payment_proof_image}`}
                                    />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                <div className={cn('form-field-container', selected_plan && 'hidden')}>
                    {libraries?.length > 0 && (
                        <FormCombobox
                            name="library_id"
                            label="Library"
                            options={libraries.map((item: any) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            value={data.library_id}
                            onChange={(val) => setData('library_id', val)}
                            error={errors.library_id}
                        />
                    )}

                    {plans?.length > 0 && (
                        <FormCombobox
                            name="plan_id"
                            label="Plan"
                            options={plans.map((item: any) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            value={data.plan_id}
                            onChange={(val) => setData('plan_id', val)}
                            error={errors.plan_id}
                        />
                    )}

                    <FormCombobox
                        name="status"
                        label="Status"
                        options={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'active', label: 'Active' },
                            { value: 'expired', label: 'Expired' },
                            { value: 'canceled', label: 'Canceled' },
                        ]}
                        value={data.status}
                        onChange={(val) => setData('status', val as any)}
                        error={errors.status}
                    />
                </div>
                {/* <div className="form-field-container">
                    <FormField
                        id="started_at"
                        name="started_at"
                        label="Start Date"
                        type="date"
                        value={data.started_at || ''}
                        onChange={(val) => setData('started_at', val)}
                        error={errors.started_at}
                        description="Will calculate base on Plan if empty"
                    />

                    <FormField
                        id="expires_at"
                        name="expires_at"
                        label="End Date"
                        type="date"
                        value={data.expires_at || ''}
                        onChange={(val) => setData('expires_at', val)}
                        error={errors.expires_at}
                        description="Will calculate base on Plan if empty"
                    />
                </div> */}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
