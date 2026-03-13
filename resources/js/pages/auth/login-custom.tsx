import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AuthLayout from '@/layouts/auth-layout';
import { Head, usePage } from '@inertiajs/react';
interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { t, currentLocale } = useTranslation();
    const { url } = usePage();
    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <Tabs defaultValue={url == '/register' ? 'register' : 'login'}>
                {/* <TabsList className="mb-6 flex justify-center">
                    <TabsTrigger value="login" className="flex-1 cursor-pointer">
                        {t('Login')}
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex-1 cursor-pointer">
                        {t('Register')}
                    </TabsTrigger>
                </TabsList> */}
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                    <RegisterForm />
                </TabsContent>
            </Tabs>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
