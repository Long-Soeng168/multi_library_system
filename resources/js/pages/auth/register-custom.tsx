import RegisterForm from '@/components/Auth/RegisterForm';
import AuthLayout from '@/layouts/auth-layout';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Head } from '@inertiajs/react';

export default function Register() {
    return (
        <FrontPageLayout>
            <AuthLayout title="Create an account" description="Enter your details below to create your account">
                <Head title="Register" />
                <RegisterForm />
            </AuthLayout>
        </FrontPageLayout>
    );
}
