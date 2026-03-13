import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import { FormField } from '@/components/Input/FormField';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface CirculationRuleForm {
    fine_amount_per_day: number;
    max_fines_amount: number;
    borrowing_limit: number;
    loan_period: number;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { data, setData, post, processing, progress, errors } = useForm<CirculationRuleForm>({
        fine_amount_per_day: editData?.fine_amount_per_day || 500,
        max_fines_amount: editData?.max_fines_amount || 50000,
        borrowing_limit: editData?.borrowing_limit || 2,
        loan_period: editData?.loan_period || 14,
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Circulation Rules', href: '/admin/circulation-rules' },
        { title: editData ? 'Edit Rules' : 'Create Rules', href: '#' },
    ];

    const { t } = useTranslation();

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

                <div className="form-field-container">
                    {/* These rules are numeric, so we display them the same in both tabs 
                        but localized labels can change based on t() */}

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
