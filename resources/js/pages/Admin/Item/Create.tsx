import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import PublishedDatePicker from '@/components/DatePicker/PublishedDatePicker';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedFile from '@/components/Form/UploadedFileDisplay';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import FormFieldMultiSelect from '@/components/Input/FormFieldMultiSelect';
import { FormLabel } from '@/components/Input/FormLabel';
import FormRadioStatus from '@/components/Input/FormRadioStatus';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { postStatusData } from '@/data/status-data';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import MyCkeditor5 from '@/pages/plugins/ckeditor5/my-ckeditor5';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import CreateUserDialog from './CreateUserDialog';

interface ItemForm {
    library_id?: string;
    code?: string;
    main_category_code?: string;
    category_code?: string | null;

    name: string;
    name_kh?: string;
    edition?: string;
    total_page?: string;

    short_description?: string;
    short_description_kh?: string;
    keywords?: string;

    long_description?: string;
    long_description_kh?: string;

    ddc?: string;
    lcc?: string;

    isbn?: string;
    eisbn?: string;
    doi?: string;

    author_ids?: { value: string; label: string }[];

    author_name?: string;
    advisor_id?: string;
    publisher_id?: string;
    published_year?: string;
    published_month?: string;
    published_day?: string;

    file_type_code?: string;
    language_code?: string;
    status?: string;

    external_link?: string;
    thumbnail?: string;
    default_file?: string;

    total_views_count?: number;
}

export default function Create({ libraries, editData, readOnly }: { libraries: any[]; editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const hasPermission = usePermission();

    const {
        user_library,
        auth,
        fileTypes,
        languages,
        selectedCategory,
        categories,
        subCategories,
        mainCategories,
        main_category_code,
        publishers,
        authors,
        advisors,
    } = usePage<any>().props;

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');
    const [selectedMainCategoryCode, setSelectedMainCategoryCode] = useState<string>(editData?.main_category_code || '');
    const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('');
    const [selectedSubCategoryCode, setSelectedSubCategoryCode] = useState<string>('');

    useEffect(() => {
        if (!selectedCategory) return;

        if (selectedCategory.parent?.code) {
            setSelectedCategoryCode(selectedCategory.parent.code);
            setSelectedSubCategoryCode(selectedCategory.code);
        } else {
            setSelectedCategoryCode(selectedCategory.code);
        }
    }, [selectedCategory]);

    const [files, setFiles] = useState<File[] | null>(null);
    const [imageFiles, setImageFiles] = useState<File[] | null>(null);
    const [thumbnailFiles, setThumbnailFiles] = useState<File[] | null>(null);
    const [defaultFiles, setDefaultFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<ItemForm>({
        library_id: editData?.library_id || (!hasPermission('item view') && auth?.user?.library_id) || '',
        code: editData?.code || '',
        category_code: editData?.category_code || null,
        main_category_code: editData?.main_category_code?.toString() || '',
        file_type_code: editData?.file_type_code || '',
        language_code: editData?.language_code || '',
        status: editData?.status || postStatusData[0]?.value || '',
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        edition: editData?.edition || '',
        short_description: editData?.short_description || '',
        keywords: editData?.keywords || '',
        short_description_kh: editData?.short_description_kh || '',
        long_description: editData?.long_description || '',
        long_description_kh: editData?.long_description_kh || '',

        ddc: editData?.ddc || '',
        lcc: editData?.lcc || '',

        isbn: editData?.isbn || '',
        eisbn: editData?.eisbn || '',
        doi: editData?.doi || '',

        author_ids:
            editData?.authors?.map((a: any) => {
                return { value: a.id.toString(), label: `(ID:${a.id}) ${a.name}` };
            }) || [],

        author_name: editData?.author_name?.toString() || '',
        advisor_id: editData?.advisor_id?.toString() || '',
        publisher_id: editData?.publisher_id?.toString() || '',
        published_year: editData?.published_year?.toString() || '',
        published_month: editData?.published_month?.toString() || '',
        published_day: editData?.published_day?.toString() || '',

        external_link: editData?.external_link || '',
        thumbnail: editData?.thumbnail || '',
        default_file: editData?.file_name || '',
        total_views_count: editData?.total_views_count || 0,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({
            ...data,
            category_code: selectedSubCategoryCode || selectedCategoryCode || null,
            thumbnail: thumbnailFiles ? thumbnailFiles[0] : null,
            default_file: defaultFiles ? defaultFiles[0] : null,
            images: imageFiles || null,
            files: files || null,
        }));

        if (editData?.id) {
            post(`/admin/items/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setThumbnailFiles(null);
                    setDefaultFiles(null);
                    setImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/items', {
                onSuccess: (page: any) => {
                    reset();
                    setFiles(null);
                    setThumbnailFiles(null);
                    setDefaultFiles(null);
                    setImageFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const ACCEPT_BY_TYPE: Record<string, any> = {
        'image-file': {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            // 'image/gif': ['.gif'],
            // 'image/svg+xml': ['.svg'],
        },
        'pdf-file': {
            'application/pdf': ['.pdf'],
        },
        'audio-file': {
            'audio/mpeg': ['.mp3'],
            // 'audio/wav': ['.wav'],
            // 'audio/ogg': ['.ogg'],
        },
        'video-file': {
            'video/mp4': ['.mp4'],
            // 'video/webm': ['.webm'],
            // 'video/ogg': ['.ogv'],
        },
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Items', href: hasPermission('item view') ? '/admin/items' : `/dashboard/library/${user_library?.code}/items` },
        { title: editData?.name || 'Create', href: '#' },
    ];

    const { t, currentLocale } = useTranslation();

    const filteredMainCategories = mainCategories?.filter((p: any) => !data.library_id || p.library_id == data.library_id);

    const filteredPublishers = publishers?.filter((p: any) => !data.library_id || p.library_id == data.library_id);
    const filteredAuthors = authors?.filter((p: any) => !data.library_id || p.library_id == data.library_id);
    const filteredAdvisors = advisors?.filter((p: any) => !data.library_id || p.library_id == data.library_id);

    const filteredCategories = categories?.filter(
        (p: any) => p.item_main_category_code == data.main_category_code && p.library_id == data.library_id,
    );

    const filteredSubCategories = subCategories?.filter((p: any) => p.parent?.code == selectedCategoryCode && p.library_id == data.library_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form
                onSubmit={onSubmit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                className="form"
            >
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
                <div className="form-field-container md:grid-cols-1">
                    {/* Required Fields */}
                    {inputLanguage == 'default' && (
                        <>
                            {libraries?.length > 0 && hasPermission('item view') && (
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
                                            setData('author_ids', []);
                                            setData('advisor_id', '');
                                            setData('publisher_id', '');

                                            setData('library_id', val);
                                            // reset categories
                                            setData('main_category_code', '');
                                            setData('category_code', '');

                                            setSelectedMainCategoryCode('');
                                            setSelectedCategoryCode('');
                                            setSelectedSubCategoryCode('');
                                        }}
                                        error={errors.library_id}
                                    />
                                    {editData?.library_id && editData?.library_id != data.library_id && (
                                        <div className="mt-2 flex items-start gap-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-500">
                                            {/* Lucide AlertTriangle Icon */}
                                            <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />

                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-yellow-900 dark:text-yellow-400">
                                                    {t('Library Change Notice')}
                                                </span>
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
                                value={data.name || ''}
                                onChange={(val) => setData('name', val)}
                                error={errors.name}
                            />
                            <div className="form-field-container">
                                <FormField
                                    id="edition"
                                    name="edition"
                                    label="Edition"
                                    value={data.edition || ''}
                                    onChange={(val) => setData('edition', val)}
                                    error={errors.edition}
                                />
                                <FormField
                                    type="number"
                                    id="total_page"
                                    name="total_page"
                                    label="Total Page"
                                    value={data.total_page || ''}
                                    onChange={(val) => setData('total_page', val)}
                                    error={errors.total_page}
                                />
                            </div>
                            {/* <FormFieldTextArea
                                id="short_description"
                                name="short_description"
                                label="Short Description"
                                value={data.short_description || ''}
                                onChange={(val) => setData('short_description', val)}
                                error={errors.short_description}
                            /> */}
                        </>
                    )}

                    {inputLanguage == 'khmer' && (
                        <>
                            <FormField
                                id="name_kh"
                                name="name_kh"
                                label="Name Khmer"
                                value={data.name_kh || ''}
                                onChange={(val) => setData('name_kh', val)}
                                error={errors.name_kh}
                            />

                            {/* <FormFieldTextArea
                                id="short_description_kh"
                                name="short_description_kh"
                                label="Short Description Khmer"
                                value={data.short_description_kh || ''}
                                onChange={(val) => setData('short_description_kh', val)}
                                error={errors.short_description_kh}
                            /> */}
                        </>
                    )}
                </div>
                {inputLanguage == 'default' && (
                    <span className="space-y-6 md:grid md:grid-cols-2 md:gap-x-6">
                        <FormCombobox
                            name="main_category_code"
                            label="Main Category"
                            disable={!data.library_id}
                            placeholder={!data.library_id ? 'Please select Library first.' : ''}
                            options={[
                                {
                                    value: null,
                                    label: t('NA'),
                                },
                                ...filteredMainCategories.map((item: any) => ({
                                    value: item.code.toString(),
                                    label: `(${item.order_index}) ${currentLocale == 'kh' ? item.name_kh || item.name : item.name}`,
                                })),
                            ]}
                            value={data.main_category_code || ''}
                            onChange={(val) => {
                                setData('category_code', '');
                                setSelectedCategoryCode('');
                                setSelectedSubCategoryCode('');

                                setData('main_category_code', val);
                                setSelectedMainCategoryCode(val);
                            }}
                            error={errors.main_category_code}
                            description="Select the Main Category that this category belongs to."
                        />
                        <FormCombobox
                            name="category_code"
                            label="Category"
                            options={[
                                {
                                    value: null,
                                    label: !data.main_category_code ? t('Please Select Main Category') : t('NA'),
                                },
                                ...filteredCategories.map((item: any) => ({
                                    value: item.code,
                                    label: `(${item.order_index}) ` + (currentLocale == 'kh' ? item.name_kh || item.name : item.name),
                                })),
                            ]}
                            disable={!data.library_id || !data.main_category_code}
                            placeholder={
                                !data.library_id
                                    ? 'Please Select Library First.'
                                    : !data.main_category_code
                                      ? 'Please Select Main Category First.'
                                      : ''
                            }
                            value={selectedCategoryCode || ''}
                            onChange={(val) => {
                                // setData('category_code', val);
                                setSelectedSubCategoryCode('');
                                setSelectedCategoryCode(val);
                            }}
                            error={errors.category_code}
                        />
                        <FormCombobox
                            name="category_code"
                            label="Sub Category"
                            options={[
                                {
                                    value: null,
                                    label: !selectedCategoryCode ? t('Please Select Category') : t('NA'),
                                },
                                ...filteredSubCategories.map((item: any) => ({
                                    value: item.code,
                                    label: `(${item.order_index}) ` + (currentLocale == 'kh' ? item.name_kh || item.name : item.name),
                                })),
                            ]}
                            disable={!data.library_id || !selectedCategoryCode}
                            placeholder={
                                !data.library_id ? 'Please Select Library First.' : !selectedCategoryCode ? 'Please Select Category First.' : ''
                            }
                            value={selectedSubCategoryCode || ''}
                            onChange={(val) => {
                                // setData('category_code', val);
                                setSelectedSubCategoryCode(val);
                            }}
                            error={errors.category_code}
                        />

                        {languages?.length > 0 && (
                            <FormCombobox
                                name="language_code"
                                label="Language"
                                options={[
                                    {
                                        value: null,
                                        label: t('NA'),
                                    },
                                    ...languages.map((item: any) => ({
                                        value: item.code,
                                        label: currentLocale == 'kh' ? item.name_kh || item.name : item.name,
                                    })),
                                ]}
                                value={data.language_code || ''}
                                onChange={(val) => setData('language_code', val)}
                                error={errors.language_code}
                            />
                        )}

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
                    </span>
                )}
                {inputLanguage == 'default' && (
                    <>
                        <div className="form-field-container mt-6">
                            <Tabs defaultValue="ddc" className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                                <TabsList className="h-auto border bg-border/50 p-1 dark:border-white/20">
                                    <div className="flex w-auto flex-wrap justify-start gap-1">
                                        <TabsTrigger
                                            value="ddc"
                                            className="h-full border text-xs font-medium whitespace-pre-wrap dark:data-[state=active]:bg-white/20"
                                        >
                                            {t('Dewey Decimal Classification')}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="lcc"
                                            className="h-full border text-xs font-medium whitespace-pre-wrap dark:data-[state=active]:bg-white/20"
                                        >
                                            {t('Library of Congress Classification')}
                                        </TabsTrigger>
                                    </div>
                                </TabsList>
                                <TabsContent value="ddc">
                                    <FormField
                                        className="bg-background"
                                        id="ddc"
                                        name="ddc"
                                        label="DDC"
                                        value={data.ddc || ''}
                                        onChange={(val) => setData('ddc', val)}
                                        error={errors.ddc}
                                    />
                                </TabsContent>
                                <TabsContent value="lcc">
                                    <FormField
                                        className="bg-background"
                                        id="lcc"
                                        name="lcc"
                                        label="LCC"
                                        value={data.lcc || ''}
                                        onChange={(val) => setData('lcc', val)}
                                        error={errors.lcc}
                                    />
                                </TabsContent>
                            </Tabs>

                            <Tabs defaultValue="isbn" className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                                <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                                    <TabsTrigger value="isbn" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('ISBN')}
                                    </TabsTrigger>
                                    <TabsTrigger value="eisbn" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('EISBN')}
                                    </TabsTrigger>
                                    <TabsTrigger value="doi" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('DOI')}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="isbn">
                                    <FormField
                                        className="bg-background"
                                        id="isbn"
                                        name="isbn"
                                        label="ISBN"
                                        value={data.isbn || ''}
                                        onChange={(val) => setData('isbn', val)}
                                        error={errors.isbn}
                                    />
                                </TabsContent>
                                <TabsContent value="eisbn">
                                    <FormField
                                        className="bg-background"
                                        id="eisbn"
                                        name="eisbn"
                                        label="EISBN"
                                        value={data.eisbn || ''}
                                        onChange={(val) => setData('eisbn', val)}
                                        error={errors.eisbn}
                                    />
                                </TabsContent>
                                <TabsContent value="doi">
                                    <FormField
                                        className="bg-background"
                                        id="doi"
                                        name="doi"
                                        label="DOI"
                                        value={data.doi || ''}
                                        onChange={(val) => setData('doi', val)}
                                        error={errors.doi}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="form-field-container md:grid-cols-1">
                            <Tabs
                                defaultValue={editData?.author_name || editData?.main_category_code == 'theses' ? 'author_name' : 'authors_select'}
                                className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50"
                            >
                                <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                                    <TabsTrigger value="authors_select" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Select Authors')}
                                    </TabsTrigger>
                                    <TabsTrigger value="author_name" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Author Name')}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="authors_select" className="mt-1">
                                    <div className="flex items-center gap-2" key={filteredAuthors?.length + data.library_id}>
                                        <FormFieldMultiSelect
                                            label=""
                                            options={[
                                                ...filteredAuthors.map((item: any) => ({
                                                    value: item.id?.toString(),
                                                    label: `(ID:${item.id}) ${item.name}`,
                                                })),
                                            ]}
                                            value={data.author_ids || []}
                                            onChange={(objectValue) => setData('author_ids', objectValue)}
                                            error={errors.author_ids}
                                            multiSelectClassName="bg-background flex-1"
                                        />
                                        <div>
                                            <div className="h-[8px]"></div>
                                            <CreateUserDialog
                                                key={data.library_id}
                                                disabled={!data.library_id}
                                                library_id={data.library_id}
                                                role="Author"
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="author_name" className="mt-1">
                                    <FormField
                                        className="bg-background"
                                        id="author_name"
                                        name="author_name"
                                        label=""
                                        placeholder="Author Name"
                                        value={data.author_name || ''}
                                        onChange={(val) => setData('author_name', val)}
                                        error={errors.author_name}
                                        description="Use this to freely type an author name."
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>

                        {data?.main_category_code == 'theses' && (
                            <div className="form-field-container md:grid-cols-1">
                                <div className="flex gap-2" key={filteredAdvisors?.length}>
                                    <FormCombobox
                                        key={data.library_id}
                                        name="advisor_id"
                                        label="Advisors"
                                        options={[
                                            {
                                                value: null,
                                                label: t('NA'),
                                            },
                                            ...filteredAdvisors.map((item: any) => ({
                                                value: item.id?.toString(),
                                                label: `(ID:${item.id}) ${item.name}`,
                                            })),
                                        ]}
                                        value={data.advisor_id?.toString() || ''}
                                        onChange={(val) => setData('advisor_id', val)}
                                        error={errors.advisor_id}
                                        className="flex-1"
                                    />
                                    <div>
                                        <div className="h-[22px]"></div>
                                        <CreateUserDialog
                                            key={data.library_id}
                                            disabled={!data.library_id}
                                            library_id={data.library_id}
                                            role="Advisor"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-field-container">
                            <div className="flex gap-2" key={filteredPublishers?.length}>
                                <FormCombobox
                                    key={`${data.publisher_id}_${data.library_id}`}
                                    name="publisher_id"
                                    label="Publisher"
                                    options={[
                                        {
                                            value: null,
                                            label: t('NA'),
                                        },
                                        ...filteredPublishers.map((item: any) => ({
                                            value: item.id?.toString(),
                                            label: `(ID:${item.id}) ${item.name}`,
                                        })),
                                    ]}
                                    value={data.publisher_id?.toString() || ''}
                                    onChange={(val) => setData('publisher_id', val)}
                                    error={errors.publisher_id}
                                    className="flex-1"
                                />
                                <div>
                                    <div className="h-[22px]"></div>
                                    <CreateUserDialog
                                        key={data.library_id}
                                        disabled={!data.library_id}
                                        library_id={data.library_id}
                                        role="Publisher"
                                    />
                                </div>
                            </div>
                            <div>
                                <PublishedDatePicker
                                    published_year={data.published_year}
                                    setPublished_year={(val) => setData('published_year', val)}
                                    published_month={data.published_month}
                                    setPublished_month={(val) => setData('published_month', val)}
                                    published_day={data.published_day}
                                    setPublished_day={(val) => setData('published_day', val)}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="form-field-container md:grid-cols-1">
                    {inputLanguage == 'default' && (
                        <div className="grid content-start gap-2">
                            <FormLabel label="Long Description" />
                            <MyCkeditor5 data={data.long_description || ''} setData={(val: any) => setData('long_description', val)} />
                        </div>
                    )}
                    {inputLanguage == 'khmer' && (
                        <div className="grid content-start gap-2">
                            <FormLabel label="Long Description Khmer" />
                            <MyCkeditor5 data={data.long_description_kh || ''} setData={(val: any) => setData('long_description_kh', val)} />
                        </div>
                    )}
                </div>

                {inputLanguage == 'default' && (
                    <>
                        <div>
                            <Tabs defaultValue="thumbnail" className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                                <TabsList className="mb-0 border bg-border/50 p-1 dark:border-white/20">
                                    <TabsTrigger value="thumbnail" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Thumbnail')}
                                    </TabsTrigger>
                                    <TabsTrigger value="images" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('More Images')}
                                    </TabsTrigger>
                                    <TabsTrigger value="files" className="h-full dark:data-[state=active]:bg-white/20">
                                        {t('Files')}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="thumbnail" className="-mt-2.5">
                                    <div className={cn('form-field-container', !editData?.thumbnail && 'md:grid-cols-1')}>
                                        <FormFileUpload
                                            key={editData?.thumbnail}
                                            id="thumbnail"
                                            label="​ "
                                            files={thumbnailFiles}
                                            setFiles={setThumbnailFiles}
                                        />
                                        {editData?.thumbnail && (
                                            <UploadedImage
                                                containerClassName="mt-0"
                                                imageContainerClassName="flex-1"
                                                label="Uploaded Thumbnail"
                                                images={editData?.thumbnail}
                                                basePath="/assets/images/items/thumb/"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="files" className="mt-1">
                                    <div className="w-full rounded-lg bg-muted/80 p-4 dark:bg-muted/50">
                                        <div className="form-field-container mb-4">
                                            {fileTypes?.length > 0 && (
                                                <FormCombobox
                                                    comboboxClassName="dark:border-white/20"
                                                    name="file_type_code"
                                                    label="File Type"
                                                    options={[
                                                        {
                                                            value: null,
                                                            label: t('NA'),
                                                        },
                                                        ...fileTypes.map((item: any) => ({
                                                            value: item.code,
                                                            label: currentLocale == 'kh' ? item.name_kh || item.name : item.name,
                                                        })),
                                                    ]}
                                                    value={data.file_type_code || ''}
                                                    onChange={(val) => {
                                                        setData('file_type_code', val);
                                                        setDefaultFiles(null);
                                                        setFiles(null);
                                                    }}
                                                    error={errors.file_type_code}
                                                />
                                            )}
                                        </div>
                                        {data?.file_type_code == 'video-youtube-url' ? (
                                            <FormField
                                                containerClassName="col-span-2"
                                                className="bg-background"
                                                id="external_link"
                                                name="external_link"
                                                label="External Link"
                                                value={data.external_link || ''}
                                                onChange={(val) => {
                                                    setData('external_link', val);
                                                }}
                                                error={errors.external_link}
                                            />
                                        ) : (
                                            <>
                                                <Tabs defaultValue="default_file" className="w-full rounded-lg bg-muted/80 dark:bg-muted/50">
                                                    <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                                                        <TabsTrigger value="default_file" className="h-full dark:data-[state=active]:bg-white/20">
                                                            {t('Default File')}
                                                        </TabsTrigger>
                                                        <TabsTrigger value="more_files" className="h-full dark:data-[state=active]:bg-white/20">
                                                            {t('More Files')}
                                                        </TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="default_file" className="mt-1">
                                                        <div className="space-y-4">
                                                            <FormFileUpload
                                                                dropzoneOptions={{
                                                                    maxFiles: 10,
                                                                    maxSize: 1024 * 1024 * 50,
                                                                    multiple: false,
                                                                    accept: data.file_type_code ? ACCEPT_BY_TYPE[data.file_type_code] : {},
                                                                }}
                                                                key={editData?.file_name}
                                                                id="default_file"
                                                                label=""
                                                                files={defaultFiles}
                                                                setFiles={setDefaultFiles}
                                                            />
                                                            {editData?.file_name && (
                                                                <UploadedFile
                                                                    containerClassName="mt-0"
                                                                    label="Uploaded Default File"
                                                                    files={editData?.file_name}
                                                                    basePath="/assets/files/items/"
                                                                    fileClassName="bg-background"
                                                                />
                                                            )}
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="more_files" className="mt-1">
                                                        <div className="space-y-4">
                                                            <FormFileUpload
                                                                dropzoneOptions={{
                                                                    maxFiles: 100,
                                                                    maxSize: 1024 * 1024 * 50,
                                                                    multiple: true,
                                                                    accept: data.file_type_code ? ACCEPT_BY_TYPE[data.file_type_code] : {},
                                                                }}
                                                                key={editData?.files?.map((img: any) => img.image || img).join('-')}
                                                                id="files"
                                                                label=""
                                                                files={files}
                                                                setFiles={setFiles}
                                                            />
                                                            {editData?.files?.length > 0 && (
                                                                <UploadedFile
                                                                    fileClassName="bg-background"
                                                                    label="Uploaded Files"
                                                                    permission="item update"
                                                                    files={editData?.files}
                                                                    deletePath="/admin/items/files/"
                                                                    basePath="/assets/files/items/"
                                                                />
                                                            )}
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="images" className="mt-1">
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
                                            label=""
                                            files={imageFiles}
                                            setFiles={setImageFiles}
                                        />
                                        {editData?.images?.length > 0 && (
                                            <UploadedImage
                                                label="Uploaded Images"
                                                permission="item update"
                                                images={editData?.images}
                                                deletePath="/admin/items/images/"
                                                basePath="/assets/images/items/thumb/"
                                            />
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="col-span-2">
                            {postStatusData?.length > 0 && (
                                <FormRadioStatus
                                    name="status"
                                    label="Status"
                                    options={postStatusData.map((item: any) => ({
                                        value: item.value,
                                        label: t(item.label),
                                        description: t(item.description),
                                    }))}
                                    value={data.status || ''}
                                    onChange={(val) => setData('status', val)}
                                    error={errors.status}
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
