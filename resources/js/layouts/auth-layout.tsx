import AuthCustomLayout from './auth/auth-custom-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthCustomLayout title={title} description={description} {...props}>
            {children}
        </AuthCustomLayout>
    );
}
