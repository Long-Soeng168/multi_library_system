import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import { FormLabel } from '@/components/Input/FormLabel';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn, toSlug } from '@/lib/utils';
import MyCkeditor5 from '@/pages/plugins/ckeditor5/my-ckeditor5';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface PageForm {
    code?: string;
    parent_code?: string | null;

    name: string;
    name_kh?: string;

    short_description?: string;
    short_description_kh?: string;

    long_description?: string;
    long_description_kh?: string;

    type_code?: string;
    button_title?: string;
    button_title_kh?: string;

    link?: string;
    icon?: string;

    total_views_count?: number;
    order_index?: number;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { types, parents, selected_page_code } = usePage<any>().props;

    const [files, setFiles] = useState<File[] | null>(null);
    const [imageFiles, setImageFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<PageForm>({
        code: editData?.code || '',
        parent_code: editData?.parent_code || selected_page_code?.toString() || null,
        type_code: editData?.type_code || types[0]?.code || '',
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        order_index: editData?.order_index || 10000,
        short_description: editData?.short_description || '',
        short_description_kh: editData?.short_description_kh || '',
        long_description: editData?.long_description || '',
        long_description_kh: editData?.long_description_kh || '',
        button_title: editData?.button_title || '',
        button_title_kh: editData?.button_title_kh || '',
        link: editData?.link || '',
        icon: editData?.icon || '',
        total_views_count: editData?.total_views_count || 0,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, icon: files ? files[0] : null, images: imageFiles || null }));

        if (editData?.id) {
            post(`/admin/pages/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/pages', {
                onSuccess: (page: any) => {
                    reset();
                    setFiles(null);
                    setImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pages', href: '/admin/pages' },
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
                    <div className="form-field-container md:grid-cols-1">
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

                        <FormField
                            id="button_title_kh"
                            name="button_title_kh"
                            label="Button title khmer"
                            value={data.button_title_kh || ''}
                            onChange={(val) => setData('button_title_kh', val)}
                            error={errors.button_title_kh}
                        />

                        <div className="col-span-2 grid content-start gap-2">
                            <FormLabel label="Long Description Khmer" />
                            <MyCkeditor5 data={data.long_description_kh || ''} setData={(val: any) => setData('long_description_kh', val)} />
                        </div>
                    </div>
                ) : (
                    <div className="form-field-container">
                        <FormField
                            disable={editData?.children_count}
                            id="code"
                            name="code"
                            label="Code"
                            value={data.code}
                            onChange={(val: string) => setData('code', toSlug(val))}
                            error={errors.code}
                            description={editData?.children_count > 0 ? `Page has children — cannot update code.` : `Example: my-item-code`}
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

                        {parents?.length > 0 && (
                            <FormCombobox
                                name="parent_code"
                                label="Parent"
                                options={[
                                    {
                                        value: null,
                                        label: t('Other'),
                                    },
                                    ...parents.map((item: any) => ({
                                        value: item.code,
                                        label: `(${item.order_index}) ` + (currentLocale == 'kh' ? item.name_kh || item.name : item.name),
                                    })),
                                ]}
                                value={data.parent_code || ''}
                                onChange={(val) => setData('parent_code', val)}
                                error={errors.parent_code}
                                description="Select the parent page where this page belongs to."
                            />
                        )}

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
                            id="button_title"
                            name="button_title"
                            label="Button title"
                            value={data.button_title || ''}
                            onChange={(val) => setData('button_title', val)}
                            error={errors.button_title}
                        />

                        <FormField
                            id="link"
                            name="link"
                            label="Link"
                            value={data.link || ''}
                            onChange={(val) => setData('link', val)}
                            error={errors.link}
                        />

                        <FormField
                            required
                            type="number"
                            id="order_index"
                            name="order_index"
                            label="Order Index"
                            value={data.order_index || 100}
                            onChange={(val) => setData('order_index', Number(val))}
                            error={errors.order_index}
                            description="Lower number has higher priority."
                        />
                        <div className="col-span-2 grid content-start gap-2">
                            <FormLabel label="Long Description" />
                            <MyCkeditor5 data={data.long_description || ''} setData={(val: any) => setData('long_description', val)} />
                        </div>

                        <div className="col-span-2">
                            <Tabs defaultValue="icon" className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                                <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                                    <TabsTrigger value="icon" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Icon')}
                                    </TabsTrigger>
                                    <TabsTrigger value="images" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Images')}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="icon">
                                    <div className={cn('form-field-container', !editData?.icon && 'md:grid-cols-1')}>
                                        <FormFileUpload key={editData?.icon} id="icon" label="Icon" files={files} setFiles={setFiles} />

                                        {editData?.icon && (
                                            <UploadedImage
                                                containerClassName="mt-0"
                                                imageContainerClassName="flex-1"
                                                label="Uploaded Icon"
                                                images={editData?.icon}
                                                basePath="/assets/images/pages/thumb/"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="images">
                                    <div>
                                        <FormFileUpload
                                            dropzoneOptions={{
                                                maxFiles: 100,
                                                maxSize: 1024 * 1024 * 4,
                                                multiple: true,
                                                accept: {
                                                    'image/jpeg': ['.jpeg', '.jpg'],
                                                    'image/png': ['.png'],
                                                    'image/gif': ['.gif'],
                                                    'image/webp': ['.webp'],
                                                },
                                            }}
                                            key={editData?.images?.map((img: any) => img.image || img).join('-')}
                                            id="images"
                                            label="Images"
                                            files={imageFiles}
                                            setFiles={setImageFiles}
                                        />
                                        {editData?.images?.length > 0 && (
                                            <UploadedImage
                                                label="Uploaded Images"
                                                permission="page update"
                                                images={editData?.images}
                                                deletePath="/admin/pages/images/"
                                                basePath="/assets/images/pages/thumb/"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
