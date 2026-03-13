import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface TypeGroupForm {
    type_code?: string;
    name: string;
    name_kh?: string;
    value?: string;
    order_index?: string;
    short_description?: string;
    short_description_kh?: string;
    image?: string | null;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { types } = usePage<any>().props;

    const [files, setFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<TypeGroupForm>({
        type_code: editData?.type_code || types[0]?.code || '',
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        value: editData?.value || '',
        order_index: editData?.order_index || 100,
        short_description: editData?.short_description || '',
        short_description_kh: editData?.short_description_kh || '',
        image: editData?.image || null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, image: files ? files[0] : null }));

        if (editData?.id) {
            post(`/admin/key-values/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/key-values', {
                onSuccess: (page: any) => {
                    reset();
                    setFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Key Values', href: '/admin/key-values' },
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

                <div className="sticky top-0">
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
                    <>
                        <div className="form-field-container">
                            <FormField
                                id="name_kh"
                                name="name_kh"
                                label="Name Khmer"
                                value={data.name_kh}
                                onChange={(val) => setData('name_kh', val)}
                                error={errors.name_kh}
                                containerClassName="col-span-2"
                            />

                            <FormFieldTextArea
                                id="short_description_kh"
                                name="short_description_kh"
                                label="Short Description Khmer"
                                value={data.short_description_kh}
                                onChange={(val) => setData('short_description_kh', val)}
                                error={errors.short_description_kh}
                                containerClassName="col-span-2"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-field-container">
                            <FormField
                                required
                                id="value"
                                name="value"
                                label="Value"
                                value={data.value}
                                onChange={(val) => setData('value', val)}
                                error={errors.value}
                            />
                            <FormField
                                required
                                id="name"
                                name="name"
                                label="Name"
                                value={data.name}
                                onChange={(val) => setData('name', val)}
                                error={errors.name}
                                containerClassName="col-span-2"
                            />
                            <FormFieldTextArea
                                id="short_description"
                                name="short_description"
                                label="Short Description"
                                value={data.short_description}
                                onChange={(val) => setData('short_description', val)}
                                error={errors.short_description}
                                containerClassName="col-span-2"
                            />
                        </div>
                        <div className="form-field-container">
                            {types?.length > 0 && (
                                <FormCombobox
                                    name="type_code"
                                    label="Type"
                                    options={types.map((item: any) => ({
                                        value: item.code,
                                        label: currentLocale == 'kh' ? item.name_kh || item.name : item.name,
                                    }))}
                                    value={data.type_code || ''}
                                    onChange={(val) => setData('type_code', val)}
                                    error={errors.type_code}
                                />
                            )}
                            <FormField
                                required
                                type="number"
                                id="order_index"
                                name="order_index"
                                label="Order Index"
                                value={data.order_index}
                                onChange={(val) => setData('order_index', val)}
                                error={errors.order_index}
                                description="Lower number has higher priority."
                            />
                        </div>

                        <div>
                            <FormFileUpload key={editData?.image} id="image" label="Image" files={files} setFiles={setFiles} />
                            {editData?.image && (
                                <UploadedImage label="Uploaded Image" images={editData?.image} basePath="/assets/images/key_values/thumb/" />
                            )}
                        </div>
                    </>
                )}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
