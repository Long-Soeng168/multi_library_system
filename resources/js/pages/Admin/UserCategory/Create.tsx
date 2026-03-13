import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface CategoryForm {
    name: string;
    name_kh?: string;
    user_category_type_code?: string | null;
    enrollment_period_months: number;
    enrollment_fee: number;
    order_index: number;

    fine_amount_per_day?: number;
    max_fines_amount?: number;
    borrowing_limit?: number;
    loan_period?: number;

    library_id?: string;
}

export default function Create({ libraries, editData, readOnly }: { libraries: any[]; editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const hasPermission = usePermission();
    const { user_library, auth, types } = usePage<any>().props;

    const { data, setData, post, processing, progress, errors, reset } = useForm<CategoryForm>({
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        user_category_type_code: editData?.user_category_type_code || null,
        enrollment_period_months: editData?.enrollment_period_months || 12,
        enrollment_fee: editData?.enrollment_fee || 4000,
        order_index: editData?.order_index || 100,

        fine_amount_per_day: editData?.fine_amount_per_day || null,
        max_fines_amount: editData?.max_fines_amount || null,
        borrowing_limit: editData?.borrowing_limit || null,
        loan_period: editData?.loan_period || null,

        library_id: editData?.library_id || (!hasPermission('item view') && auth?.user?.library_id) || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editData?.id) {
            post(`/admin/user-categories/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/user-categories', {
                onSuccess: (page: any) => {
                    reset();
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        {
            title: 'User Categories',
            href: hasPermission('user view') ? '/admin/user-categories' : `/dashboard/library/${user_library?.code}/user-categories`,
        },
        { title: editData?.name || 'Create', href: '#' },
    ];

    const { t, currentLocale } = useTranslation();

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

                <div className="sticky top-0 z-10">
                    <Tabs value={inputLanguage} onValueChange={(val: any) => setInputLanguage(val)}>
                        <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                            <TabsTrigger value="default" className="h-full dark:data-[state=active]:bg-white/20">
                                {t('Default')}
                            </TabsTrigger>
                            <TabsTrigger value="khmer" className="h-full dark:data-[state=active]:bg-white/20">
                                {t('Khmer')}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {inputLanguage == 'khmer' ? (
                    <div className="form-field-container md:grid-cols-1">
                        <FormField
                            id="name_kh"
                            name="name_kh"
                            label="Name Khmer"
                            value={data.name_kh || ''}
                            onChange={(val) => setData('name_kh', val)}
                            error={errors.name_kh}
                        />
                    </div>
                ) : (
                    <div className="form-field-container">
                        {libraries?.length > 0 && hasPermission('user view') && (
                            <div className="col-span-2">
                                <FormCombobox
                                    name="library_id"
                                    label="Library"
                                    options={[
                                        {
                                            value: null,
                                            label: t(`NA`),
                                        },
                                        ...libraries.map((item: any) => ({
                                            value: item.id,
                                            label: `ID: ${item?.id} - ${item?.name} ${item?.phone ? '(' + item?.phone + ')' : ''}`,
                                        })),
                                    ]}
                                    value={data.library_id || ''}
                                    onChange={(val) => setData('library_id', val)}
                                    error={errors.library_id}
                                />
                                {editData?.library_id && editData?.library_id != data.library_id && (
                                    <div className="mt-2 flex items-start gap-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-500">
                                        {/* Lucide AlertTriangle Icon */}
                                        <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />

                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-yellow-900 dark:text-yellow-400">{t('Library Change Notice')}</span>
                                            <span>
                                                {t(
                                                    'Warning: You are about to change the library. This action may restrict the previous library access.',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <FormField
                            required
                            id="name"
                            name="name"
                            label="Category Name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                        />

                        {types?.length > 0 && (
                            <FormCombobox
                                name="user_category_type_code"
                                label="User Type"
                                options={[
                                    { value: null, label: t('NA') },
                                    ...types.map((item: any) => ({
                                        value: item.code,
                                        label: currentLocale == 'kh' ? item.name_kh || item.name : item.name,
                                    })),
                                ]}
                                value={data.user_category_type_code || ''}
                                onChange={(val) => setData('user_category_type_code', val)}
                                error={errors.user_category_type_code}
                                description="Group this category under a type (e.g., Adult, Child)."
                            />
                        )}

                        <FormField
                            required
                            type="number"
                            id="enrollment_period_months"
                            name="enrollment_period_months"
                            label="Enrollment Period (Months)"
                            value={data.enrollment_period_months}
                            onChange={(val) => setData('enrollment_period_months', parseInt(val))}
                            error={errors.enrollment_period_months}
                            description="How many months the membership lasts before expiration."
                        />

                        <FormField
                            required
                            type="number"
                            id="enrollment_fee"
                            name="enrollment_fee"
                            label="Enrollment Fee"
                            value={data.enrollment_fee}
                            onChange={(val) => setData('enrollment_fee', parseFloat(val))}
                            error={errors.enrollment_fee}
                            description="The fee charged for joining this category."
                        />
                        <FormField
                            required
                            type="number"
                            id="order_index"
                            name="order_index"
                            label="Order Index"
                            value={data.order_index}
                            onChange={(val) => setData('order_index', parseInt(val))}
                            error={errors.order_index}
                            description="Lower number shows first in dropdowns."
                        />

                        <div className="rounded-md bg-accent/80 p-4 md:col-span-2 dark:bg-accent/50">
                            <div className="form-field-container">
                                <FormField
                                    type="number"
                                    id="fine_amount_per_day"
                                    name="fine_amount_per_day"
                                    label={t('Fine Amount Per Day')}
                                    value={data.fine_amount_per_day}
                                    onChange={(val) => setData('fine_amount_per_day', parseFloat(val))}
                                    error={errors.fine_amount_per_day}
                                    description={t('The daily fine for overdue items (e.g., 500 Riels).')}
                                    className="bg-background"
                                />

                                <FormField
                                    className="bg-background"
                                    type="number"
                                    id="max_fines_amount"
                                    name="max_fines_amount"
                                    label={t('Max Fines Amount')}
                                    value={data.max_fines_amount}
                                    onChange={(val) => setData('max_fines_amount', parseFloat(val))}
                                    error={errors.max_fines_amount}
                                    description={t('The maximum fine total a user can accumulate.')}
                                />

                                <FormField
                                    className="bg-background"
                                    type="number"
                                    id="borrowing_limit"
                                    name="borrowing_limit"
                                    label={t('Borrowing Limit')}
                                    value={data.borrowing_limit}
                                    onChange={(val) => setData('borrowing_limit', parseInt(val))}
                                    error={errors.borrowing_limit}
                                    description={t('Maximum number of items a user can have checked out.')}
                                />

                                <FormField
                                    className="bg-background"
                                    type="number"
                                    id="loan_period"
                                    name="loan_period"
                                    label={t('Loan Period (Days)')}
                                    value={data.loan_period}
                                    onChange={(val) => setData('loan_period', parseInt(val))}
                                    error={errors.loan_period}
                                    description={t('The number of days an item can be borrowed.')}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
