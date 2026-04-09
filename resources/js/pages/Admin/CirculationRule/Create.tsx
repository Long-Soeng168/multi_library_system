import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import LibraryStatusCard from '@/components/Card/LibraryStatusCard';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, PencilLineIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface CirculationRuleForm {
    fine_amount_per_day: number;
    max_fines_amount: number;
    borrowing_limit: number;
    loan_period: number;
    library_id?: string;
}

export default function Create({ libraries, editData, readOnly }: { libraries: any[]; editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const { data, setData, post, processing, progress, errors } = useForm<CirculationRuleForm>({
        fine_amount_per_day: editData?.fine_amount_per_day || 500,
        max_fines_amount: editData?.max_fines_amount || 50000,
        borrowing_limit: editData?.borrowing_limit || 2,
        loan_period: editData?.loan_period || 14,
        library_id: editData?.library_id || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editData?.id) {
            post(`/admin/circulation-rules/${editData.id}/update`, {
                preserveState: true,
                onSuccess: (page: any) => {
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/circulation-rules', {
                onSuccess: (page: any) => {
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const { t } = useTranslation();
    const hasPermission = usePermission();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Circulation Rule', href: hasPermission('circulation create') ? '/admin/circulation-rules' : '#' },
        { title: editData ? 'Edit Rule' : 'Create Rule', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <LibraryStatusCard />
            <form onSubmit={onSubmit} className="form">
                <AlertFlashMessage
                    key={flashMessage.message}
                    type={flashMessage.type}
                    flashMessage={flashMessage.message}
                    setFlashMessage={setFlashMessage}
                />
                {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}
                <div className="flex items-center gap-4 py-6">
                    {/* Icon Container using shadcn/ui variables */}
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-colors ${
                            editData ? 'border-primary/20 bg-primary/10 text-primary' : 'border-border bg-muted text-muted-foreground'
                        }`}
                    >
                        {editData ? <PencilLineIcon className="h-6 w-6" strokeWidth={2.25} /> : <PlusIcon className="h-6 w-6" strokeWidth={2.25} />}
                    </div>

                    {/* Text Content */}
                    <div className="space-y-0.5">
                        <h2 className="text-lg font-bold tracking-tight text-foreground">{editData ? 'Edit Default Rule' : 'Set Default Rule'}</h2>
                        <p className="text-sm text-muted-foreground">
                            {editData ? 'Manage the main rules for borrowing and fines.' : 'Set the main rules for borrowing and fines.'}
                        </p>
                    </div>
                </div>
                <div className="form-field-container py-2">
                    {/* These rules are numeric, so we display them the same in both tabs 
                        but localized labels can change based on t() */}
                    {libraries?.length > 0 && hasPermission('circulation create') && (
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
                                            {t('Warning: You are about to change the library. This action may restrict the previous library access.')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <FormField
                        required
                        type="number"
                        id="fine_amount_per_day"
                        name="fine_amount_per_day"
                        label={t('Fine Amount Per Day')}
                        value={data.fine_amount_per_day}
                        onChange={(val) => setData('fine_amount_per_day', parseFloat(val))}
                        error={errors.fine_amount_per_day}
                        description={t('The daily fine for overdue items (e.g., 500 Riels).')}
                    />

                    <FormField
                        required
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
                        required
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
                        required
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

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
