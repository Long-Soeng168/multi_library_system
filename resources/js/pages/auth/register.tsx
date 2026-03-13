import RegisterForm from '@/components/Auth/RegisterForm';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <RegisterForm />
        </AuthLayout>
    );
}
