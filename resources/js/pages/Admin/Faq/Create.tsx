import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
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
    question: string;
    question_kh?: string;
    order_index?: string;
    answer?: string;
    answer_kh?: string;
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
        question: editData?.question || '',
        question_kh: editData?.question_kh || '',
        order_index: editData?.order_index || 100,
        answer: editData?.answer || '',
        answer_kh: editData?.answer_kh || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, image: files ? files[0] : null }));

        if (editData?.id) {
            post(`/admin/faqs/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/faqs', {
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
        { title: 'FAQ', href: '/admin/faqs' },
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
                                id="question_kh"
                                name="question_kh"
                                label="Question Khmer"
                                value={data.question_kh}
                                onChange={(val) => setData('question_kh', val)}
                                error={errors.question_kh}
                                containerClassName="col-span-2"
                            />

                            <FormFieldTextArea
                                id="answer_kh"
                                name="answer_kh"
                                label="Answer Khmer"
                                value={data.answer_kh}
                                onChange={(val) => setData('answer_kh', val)}
                                error={errors.answer_kh}
                                containerClassName="col-span-2"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="form-field-container">
                            <FormField
                                required
                                id="question"
                                name="question"
                                label="Question"
                                value={data.question}
                                onChange={(val) => setData('question', val)}
                                error={errors.question}
                                containerClassName="col-span-2"
                            />

                            <FormFieldTextArea
                                required
                                id="answer"
                                name="answer"
                                label="Answer"
                                value={data.answer}
                                onChange={(val) => setData('answer', val)}
                                error={errors.answer}
                                containerClassName="col-span-2"
                            />
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
                    </>
                )}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
