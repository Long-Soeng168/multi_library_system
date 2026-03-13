import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedFile from '@/components/Form/UploadedFileDisplay';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import { FormLabel } from '@/components/Input/FormLabel';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { postStatusData } from '@/data/status-data';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import MyCkeditor5 from '@/pages/plugins/ckeditor5/my-ckeditor5';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface PageForm {
    code?: string;
    category_code?: string | null;

    title: string;
    title_kh?: string;

    short_description?: string;
    short_description_kh?: string;
    keywords?: string;

    long_description?: string;
    long_description_kh?: string;

    type_code?: string;
    language_code?: string;
    status?: string;

    external_link?: string;
    thumbnail?: string;

    total_views_count?: number;
    order_index?: number;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { types, languages, categories } = usePage<any>().props;

    const [files, setFiles] = useState<File[] | null>(null);
    const [imageFiles, setImageFiles] = useState<File[] | null>(null);
    const [thumbnailFiles, setThumbnailFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<PageForm>({
        code: editData?.code || '',
        category_code: editData?.category_code || null,
        type_code: editData?.type_code || types[0]?.code || '',
        language_code: editData?.language_code || languages[0]?.code || '',
        status: editData?.status || postStatusData[0]?.value || '',
        title: editData?.title || '',
        title_kh: editData?.title_kh || '',
        short_description: editData?.short_description || '',
        keywords: editData?.keywords || '',
        short_description_kh: editData?.short_description_kh || '',
        long_description: editData?.long_description || '',
        long_description_kh: editData?.long_description_kh || '',
        external_link: editData?.external_link || '',
        thumbnail: editData?.thumbnail || '',
        total_views_count: editData?.total_views_count || 0,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, thumbnail: thumbnailFiles ? thumbnailFiles[0] : null, images: imageFiles || null, files: files || null }));

        if (editData?.id) {
            post(`/admin/posts/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setThumbnailFiles(null);
                    setImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/posts', {
                onSuccess: (page: any) => {
                    reset();
                    setFiles(null);
                    setThumbnailFiles(null);
                    setImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Posts', href: '/admin/posts' },
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
                    <div className="form-field-container">
                        <FormField
                            id="title_kh"
                            name="title_kh"
                            label="Title Khmer"
                            value={data.title_kh || ''}
                            onChange={(val) => setData('title_kh', val)}
                            error={errors.title_kh}
                            containerClassName="col-span-2"
                        />

                        <FormFieldTextArea
                            id="short_description_kh"
                            name="short_description_kh"
                            label="Short Description Khmer"
                            value={data.short_description_kh || ''}
                            onChange={(val) => setData('short_description_kh', val)}
                            error={errors.short_description_kh}
                            containerClassName="col-span-2"
                        />
                    </div>
                ) : (
                    <div className="form-field-container">
                        <FormField
                            required
                            id="title"
                            name="title"
                            label="Title"
                            value={data.title || ''}
                            onChange={(val) => setData('title', val)}
                            error={errors.title}
                            containerClassName="col-span-2"
                        />
                        <FormFieldTextArea
                            id="short_description"
                            name="short_description"
                            label="Short Description"
                            value={data.short_description || ''}
                            onChange={(val) => setData('short_description', val)}
                            error={errors.short_description}
                            containerClassName="col-span-2"
                        />
                        {categories?.length > 0 && (
                            <FormCombobox
                                name="category_code"
                                label="Category"
                                options={[
                                    {
                                        value: null,
                                        label: t('NA'),
                                    },
                                    ...categories.map((item: any) => ({
                                        value: item.code,
                                        label: `(${item.order_index}) ` + (currentLocale == 'kh' ? item.name_kh || item.name : item.name),
                                    })),
                                ]}
                                value={data.category_code || ''}
                                onChange={(val) => setData('category_code', val)}
                                error={errors.category_code}
                                description="Select the category where this item belongs to."
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
                        {postStatusData?.length > 0 && (
                            <FormCombobox
                                name="status"
                                label="Status"
                                options={postStatusData.map((item: any) => ({
                                    value: item.value,
                                    label: t(item.label),
                                }))}
                                value={data.status || ''}
                                onChange={(val) => setData('status', val)}
                                error={errors.status}
                            />
                        )}
                        {languages?.length > 0 && (
                            <FormCombobox
                                name="language_code"
                                label="Language"
                                options={languages.map((item: any) => ({
                                    value: item.code,
                                    label: currentLocale == 'kh' ? item.name_kh || item.name : item.name,
                                }))}
                                value={data.language_code || ''}
                                onChange={(val) => setData('language_code', val)}
                                error={errors.language_code}
                            />
                        )}
                        <FormField
                            containerClassName="col-span-2"
                            id="external_link"
                            name="external_link"
                            label="External Link"
                            value={data.external_link || ''}
                            onChange={(val) => setData('external_link', val)}
                            error={errors.external_link}
                        />
                        <FormField
                            containerClassName="col-span-2"
                            id="keywords"
                            name="keywords"
                            label="Keywords"
                            value={data.keywords || ''}
                            onChange={(val) => setData('keywords', val)}
                            error={errors.keywords}
                            description="Help users find your content more easily. Example: <b>election, candidates, political debate</b>"
                        />
                    </div>
                )}

                <div className="form-field-container md:grid-cols-1">
                    {inputLanguage == 'khmer' ? (
                        <div className="grid content-start gap-2">
                            <FormLabel label="Long Description Khmer" />
                            <MyCkeditor5 data={data.long_description_kh || ''} setData={(val: any) => setData('long_description_kh', val)} />
                        </div>
                    ) : (
                        <div className="grid content-start gap-2">
                            <FormLabel label="Long Description" />
                            <MyCkeditor5 data={data.long_description || ''} setData={(val: any) => setData('long_description', val)} />
                        </div>
                    )}
                </div>

                {inputLanguage == 'default' && (
                    <>
                        <div>
                            <Tabs defaultValue="thumbnail" className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                                <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                                    <TabsTrigger value="thumbnail" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Thumbnail')}
                                    </TabsTrigger>
                                    <TabsTrigger value="images" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Images')}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="thumbnail">
                                    <div className={cn('form-field-container', !editData?.thumbnail && 'md:grid-cols-1')}>
                                        <FormFileUpload
                                            key={editData?.thumbnail}
                                            id="thumbnail"
                                            label="Thumbnail"
                                            files={thumbnailFiles}
                                            setFiles={setThumbnailFiles}
                                        />
                                        {editData?.thumbnail && (
                                            <UploadedImage
                                                containerClassName="mt-0"
                                                imageContainerClassName="flex-1"
                                                label="Uploaded Thumbnail"
                                                images={editData?.thumbnail}
                                                basePath="/assets/images/posts/thumb/"
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
                                                permission="post update"
                                                images={editData?.images}
                                                deletePath="/admin/posts/images/"
                                                basePath="/assets/images/posts/thumb/"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                            <FormFileUpload
                                dropzoneOptions={{
                                    maxFiles: 100,
                                    maxSize: 1024 * 1024 * 50,
                                    multiple: true,
                                    accept: {},
                                }}
                                key={editData?.files?.map((img: any) => img.image || img).join('-')}
                                id="files"
                                label="Files"
                                files={files}
                                setFiles={setFiles}
                            />
                            {editData?.files?.length > 0 && (
                                <UploadedFile
                                    fileClassName="bg-background"
                                    label="Uploaded Files"
                                    permission="post update"
                                    files={editData?.files}
                                    deletePath="/admin/posts/files/"
                                    basePath="/assets/files/posts/"
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
