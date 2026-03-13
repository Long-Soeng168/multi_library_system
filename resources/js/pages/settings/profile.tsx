import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormErrorLabel } from '@/components/Input/FormErrorLabel';
import { FormField } from '@/components/Input/FormField';
import { FormLabel } from '@/components/Input/FormLabel';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import RadioSelect from '@/components/Section/RadioSelect';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface UserForm {
    name: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
    password_confirmation: string;
    image: string | null;
}

export default function Create() {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const { auth } = usePage<any>().props;

    const [files, setFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<UserForm>({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        gender: auth?.user?.gender || '',
        password: '',
        password_confirmation: '',
        image: auth?.user?.image || null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, image: files ? files[0] : null }));

        post(`/settings/profile/update`, {
            onSuccess: (page: any) => {
                setFiles(null);
                setFlashMessage({ message: page.props.flash?.success, type: 'success' });
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile settings', href: '/settings/profile' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <form onSubmit={onSubmit} className="form p-0 pb-20">
                    <AlertFlashMessage
                        key={flashMessage.message}
                        type={flashMessage.type}
                        flashMessage={flashMessage.message}
                        setFlashMessage={setFlashMessage}
                    />
                    {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}
                    <div className="form-field-container md:grid-cols-1">
                        <FormField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                        />

                        <FormField
                            required
                            type="number"
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            value={data.phone}
                            onChange={(val) => setData('phone', val)}
                            error={errors.phone}
                        />

                        <div>
                            <FormField
                                required
                                id="email"
                                name="email"
                                label="Email"
                                value={data.email}
                                onChange={(val) => setData('email', val)}
                                error={errors.email}
                            />
                        </div>

                        <div className="grid content-start gap-2">
                            <FormLabel id="gender" label="Gender" required={true} />
                            <RadioSelect
                                name="gender"
                                options={[
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                    { label: 'Other', value: 'other' },
                                ]}
                                value={data.gender}
                                onChange={(val) => setData('gender', val)}
                            />
                            <FormErrorLabel error={errors.gender} />
                        </div>
                    </div>

                    <div>
                        <FormFileUpload key={auth?.user?.image} id="profile-image" label="Profile Image" files={files} setFiles={setFiles} />
                        {auth?.user?.image && (
                            <UploadedImage label="Uploaded Image" images={auth?.user?.image} basePath="/assets/images/users/thumb/" />
                        )}
                    </div>

                    {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                    <SubmitButton processing={processing} />
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
