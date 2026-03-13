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
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface TypeGroupForm {
    library_id?: string;
    parent_id?: string;
    item_main_category_code?: string;
    name: string;
    name_kh?: string;
    order_index?: string;
    short_description?: string;
    short_description_kh?: string;
    image?: string | null;
}

export default function Create({ libraries, editData, readOnly }: { libraries: any[]; editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { parents, mainCategories, filtered_category_id, main_category_code } = usePage<any>().props;

    const [files, setFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<TypeGroupForm>({
        library_id: editData?.library_id || '',
        parent_id: editData?.parent_id?.toString() || filtered_category_id?.toString() || '',
        item_main_category_code: editData?.item_main_category_code?.toString() || main_category_code?.toString() || '',
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        order_index: editData?.order_index || 10000,
        short_description: editData?.short_description || '',
        short_description_kh: editData?.short_description_kh || '',
        image: editData?.image || null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, image: files ? files[0] : null }));

        if (editData?.id) {
            post(`/admin/item-categories/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/item-categories', {
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
        { title: 'Items', href: '/admin/items' },
        { title: 'Categories', href: '/admin/item-categories' },
        { title: editData?.name || 'Create', href: '#' },
    ];

    const { t, currentLocale } = useTranslation();

    const filteredParents = parents?.filter((p: any) => p.item_main_category_code == data.item_main_category_code);

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
                        />

                        <FormFieldTextArea
                            id="short_description_kh"
                            name="short_description_kh"
                            label="Short Description Khmer"
                            value={data.short_description_kh}
                            onChange={(val) => setData('short_description_kh', val)}
                            error={errors.short_description_kh}
                        />
                    </div>
                ) : (
                    <div className="form-field-container">
                        {libraries?.length > 0 && (
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
                                    onChange={(val) => {
                                        setData('item_main_category_code', '');
                                        setData('parent_id', '');
                                        setData('library_id', val);
                                    }}
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
                )}
                {inputLanguage == 'default' && (
                    <>
                        <div className="form-field-container">
                            <FormCombobox
                                name="item_main_category_code"
                                label="Main Category"
                                required
                                options={[
                                    {
                                        value: null,
                                        label: t('NA'),
                                    },
                                    ...mainCategories
                                        .filter((item: any) => item.library_id === data?.library_id)
                                        .map((item: any) => ({
                                            value: item.code.toString(),
                                            label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                                        })),
                                ]}
                                value={data.item_main_category_code || ''}
                                onChange={(val) => {
                                    setData('parent_id', '');
                                    setData('item_main_category_code', val);
                                }}
                                error={errors.item_main_category_code}
                                description="Select the Main Category that this category belongs to."
                            />
                            <FormCombobox
                                name="parent_id"
                                label="Parent"
                                options={[
                                    {
                                        value: null,
                                        label: !data.item_main_category_code ? t('Please Select Main Category') : t('NA'),
                                    },
                                    ...filteredParents
                                        .filter((item: any) => item.library_id === data?.library_id)
                                        .map((item: any) => ({
                                            value: item.id.toString(),
                                            label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                                        })),
                                ]}
                                disable={!data.item_main_category_code}
                                placeholder={!data.item_main_category_code ? 'Please Select Main Category First.' : ''}
                                value={data.parent_id || ''}
                                onChange={(val) => setData('parent_id', val)}
                                error={errors.parent_id}
                                description="Select the parent that this category belongs to."
                            />

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
                        <div className={cn('form-field-container', !editData?.image && 'md:grid-cols-1')}>
                            <FormFileUpload
                                key={editData?.image}
                                id="image"
                                label="Image (512 x 512 pixels)"
                                files={files}
                                setFiles={setFiles}
                                error={errors?.image}
                            />
                            {editData?.image && (
                                <UploadedImage
                                    containerClassName="mt-0"
                                    imageContainerClassName="flex-1"
                                    label="Uploaded Image"
                                    images={editData?.image}
                                    basePath="/assets/images/item_categories/thumb/"
                                />
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
