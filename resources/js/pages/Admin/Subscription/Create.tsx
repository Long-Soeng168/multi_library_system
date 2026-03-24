import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface SubscriptionForm {
    library_id: string;
    plan_id: string;
    status: 'active' | 'pending' | 'expired' | 'canceled';
    started_at?: string;
    expires_at?: string;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const { libraries, plans } = usePage<any>().props;
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm<SubscriptionForm>({
        library_id: editData?.library_id || '',
        plan_id: editData?.plan_id || '',
        status: editData?.status || 'pending',
        started_at: editData?.started_at || '',
        expires_at: editData?.expires_at || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editData?.id) {
            post(`/admin/subscriptions/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/subscriptions', {
                onSuccess: (page: any) => {
                    reset();
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

                <div className="form-field-container">
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
