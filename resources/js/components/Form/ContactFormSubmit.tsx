import { Card, CardContent } from '@/components/ui/card';
import { useForm } from '@inertiajs/react';
import { ArrowRight, LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FormField } from '../Input/FormField';
import { FormFieldTextArea } from '../Input/FormFieldTextArea';

const ContactFormSubmit = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post('/submit-message', {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    toast.success('Success', {
                        description: page.props.flash.success,
                    });
                    setSuccessMessage(page.props.flash?.success);
                    reset();
                }
                if (page.props.flash?.error) {
                    toast.error('Error', {
                        description: page.props.flash.error,
                    });
                }
            },
            onError: () => {
                toast.error('Error', {
                    description: 'Failed to send message.',
                });
            },
        });
    };

    return (
        <Card className="relative overflow-hidden rounded-lg bg-muted/10 py-0">
            <CardContent className="relative z-10 p-6">
                <form onSubmit={handleSubmit}>
                    <h2 className="mb-6 text-center text-2xl font-bold">Send Us a Message</h2>

                    <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                        <div className="col-span-2">
                            <FormField
                                required
                                type="text"
                                id="name"
                                name="name"
                                label="Name"
                                value={data.name}
                                className="bg-background"
                                onChange={(val) => setData('name', val)}
                                error={errors.name}
                            />
                        </div>

                        <div className="col-span-2">
                            <FormField
                                required
                                type="number"
                                id="phone"
                                name="phone"
                                label="Phone"
                                value={data.phone}
                                className="bg-background"
                                onChange={(val) => setData('phone', val)}
                                error={errors.phone}
                            />
                        </div>

                        <div className="col-span-2">
                            <FormField
                                required
                                type="text"
                                id="email"
                                name="email"
                                label="Email"
                                value={data.email}
                                className="bg-background"
                                onChange={(val) => setData('email', val)}
                                error={errors.email}
                            />
                        </div>

                        <div className="col-span-2">
                            <FormFieldTextArea
                                required
                                id="message"
                                name="message"
                                label="Message"
                                value={data.message}
                                onChange={(val) => setData('message', val)}
                                error={errors.message}
                            />
                        </div>
                    </div>
                    {successMessage && <p className="mt-1 text-center text-sm text-green-500">{successMessage}</p>}
                    {successMessage && <p className="mt-1 text-center text-sm text-green-500">We will get back to you as soon as possible.</p>}

                    <button
                        type="submit"
                        disabled={processing}
                        className="group relative mx-auto mt-8 w-42 cursor-pointer overflow-hidden rounded-lg border bg-true-primary p-2 text-center font-semibold text-white"
                    >
                        <span
                            className={`inline-block transition-all duration-300 ${processing ? 'opacity-0' : 'translate-x-1 group-hover:translate-x-12 group-hover:opacity-0'}`}
                        >
                            Submit
                        </span>
                        <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-true-primary opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
                            Submit
                            {processing ? <LoaderIcon className="animate-spin" /> : <ArrowRight />}
                        </div>
                        <div className="absolute top-[40%] left-[20%] h-2 w-2 scale-[1] rounded-lg bg-white transition-all duration-300 group-hover:top-[0%] group-hover:left-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-white"></div>
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ContactFormSubmit;
