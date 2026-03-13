import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import { FormField } from '@/components/Input/FormField';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { useForm } from '@inertiajs/react';
import { LoaderCircleIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface UserForm {
    name: string;
    name_kh: string;
    card_number: string;
    expired_at: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
    title_type_code?: string;
    category_code?: string;
    password_confirmation: string;
    image: string | null;
    roles: string[];
    library_id?: string;
}

export default function CreateUserDialog({
    editData,
    role,
    disabled = false,
    library_id,
}: {
    editData?: any;
    role: string;
    disabled?: boolean;
    library_id?: string;
}) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [files, setFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<UserForm>({
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        card_number: editData?.card_number || '',
        expired_at: editData?.expired_at || '',
        email: editData?.email || '',
        phone: editData?.phone || '',
        gender: editData?.gender || '',
        title_type_code: editData?.title_type_code || '',
        category_code: editData?.category_code || '',
        password: '',
        password_confirmation: '',
        image: editData?.image || null,
        roles: [role],
        library_id: library_id,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const randomString = Math.random().toString(36).substring(2, 8);
        const radomEmail = `user-${randomString}@email.com`;
        transform(() => ({ ...data, email: radomEmail, password: radomEmail, password_confirmation: radomEmail, image: files ? files[0] : null }));

        post('/admin/users', {
            onSuccess: (page: any) => {
                reset();
                setFiles(null);
                setFlashMessage({ message: page.props.flash?.success, type: 'success' });
            },
        });
    };

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');
    const { t, currentLocale } = useTranslation();

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button disabled={disabled} className="rounded" variant="outline" type="button">
                        <PlusIcon />
                        {currentLocale == 'kh' ? 'បន្ថែមថ្មី' : 'New'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t('Create')} {t(role)}
                        </DialogTitle>
                        <form onSubmit={onSubmit} className="form p-0 pt-4">
                            <AlertFlashMessage
                                key={flashMessage.message}
                                type={flashMessage.type}
                                flashMessage={flashMessage.message}
                                setFlashMessage={setFlashMessage}
                            />
                            {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}

                            <div>
                                <FormField
                                    required
                                    id="name"
                                    name="name"
                                    label="Name"
                                    value={data.name}
                                    onChange={(val) => setData('name', val)}
                                    error={errors.name}
                                />
                            </div>

                            {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                            <div className="flex justify-end">
                                <Button disabled={processing} type="button" onClick={onSubmit} className="h-11 px-6">
                                    {processing && (
                                        <span className="mr-2 size-6 animate-spin">
                                            <LoaderCircleIcon />
                                        </span>
                                    )}
                                    {processing ? t('Submitting') : t('Submit')}
                                </Button>
                            </div>
                        </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
