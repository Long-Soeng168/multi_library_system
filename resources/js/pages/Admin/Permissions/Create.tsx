import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import { FormField } from '@/components/Input/FormField';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const { data, setData, post, put, progress, processing, reset, errors } = useForm({
        name: '',
    });

    useEffect(() => {
        editData?.name && setData('name', editData?.name);
    }, []);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (editData?.id && !readOnly) {
            // Update Item
            put(`/admin/permissions/${editData.id}`, {
                onSuccess: (page: any) => {
                    if (page.props.flash?.success) {
                        setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                    }
                },
            });
        } else {
            // Create New Item
            post('/admin/permissions', {
                onSuccess: (page: any) => {
                    reset();
                    if (page.props.flash?.success) {
                        setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                    }
                },
            });
        }
    }

    return (
        <form onSubmit={onSubmit} className="form px-0">
            <AlertFlashMessage
                key={flashMessage.message}
                type={flashMessage.type}
                flashMessage={flashMessage.message}
                setFlashMessage={setFlashMessage}
            />
            {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}

            <div className="form-field-container grid-cols-1">
                <FormField
                    id="name"
                    name="name"
                    label="Name"
                    value={data.name}
                    onChange={(val: string) => setData('name', val)}
                    error={errors.name}
                />
            </div>

            {progress && <ProgressWithValue value={progress.percentage} position="start" />}
            <div className="flex justify-end gap-2">{!readOnly && <SubmitButton processing={processing} />}</div>
        </form>
    );
}
