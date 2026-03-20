import LoginForm from '@/components/Auth/LoginForm';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link } from '@inertiajs/react';
import { BookOpenIcon, ShieldCheckIcon, SmartphoneIcon, ZapIcon } from 'lucide-react';

const BanalaiLogin = () => {
    // Adjusted for better visibility in both modes
    const imgBgColors = [
        'bg-yellow-500/20 border border-yellow-400/30',
        'bg-green-500/20 border border-green-400/30',
        'bg-yellow-500/20 border border-yellow-400/30',
        'bg-slate-100/20 border border-slate-100/10',
    ];

    return (
        <FrontPageLayout>
            {/* Background wrapper using Shadcn-like tokens */}
            <div className="min-h-screen bg-background font-sans transition-colors duration-300">
                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
                    <div className="w-full max-w-6xl">
                        {/* Card Container */}
                        <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl transition-colors">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left Side - Branding (Stays vibrant but slightly deeper for dark mode) */}
                                <div className="hidden flex-col justify-center bg-[linear-gradient(141deg,#4f46e5,#4a4ae6,#454de7,#3f51e7,#3a55e8,#3558e9,#305cea,#2a5fea,#2563eb,#236bd7,#2173c3,#1f7baf,#1e839b,#1c8b86,#1a9372,#189b5e,#16a34a)] p-12 text-white lg:flex">
                                    <h2 className="mb-4 text-3xl font-bold tracking-tight">Join Banalai Today</h2>
                                    <p className="mb-10 text-lg text-indigo-100/90">
                                        Create your account and start accessing thousands of digital resources.
                                    </p>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                title: 'Digital Library Access',
                                                desc: 'Access millions of digital resources, e-books, and journals from anywhere.',
                                                icon: BookOpenIcon, // Pass the component reference
                                            },
                                            {
                                                title: 'Secure & Reliable',
                                                desc: 'Your data is protected with enterprise-grade security and encryption.',
                                                icon: ShieldCheckIcon,
                                            },
                                            {
                                                title: 'Fast & Efficient',
                                                desc: 'Lightning-fast search and instant access to all your library resources.',
                                                icon: ZapIcon,
                                            },
                                            {
                                                title: 'Mobile Friendly',
                                                desc: 'Access your library on any device, anywhere, at any time.',
                                                icon: SmartphoneIcon,
                                            },
                                        ].map((item, index) => {
                                            const Icon = item.icon; // Capitalize to use as a component
                                            return (
                                                <div key={index} className="flex items-start">
                                                    <div
                                                        className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${imgBgColors[index % imgBgColors.length]}`}
                                                    >
                                                        <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                                                    </div>
                                                    <div>
                                                        <h3 className="mb-1 text-xl font-semibold">{item.title}</h3>
                                                        <p className="text-indigo-100/80">{item.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-12 border-t border-white/10 pt-8">
                                        <p className="text-sm text-indigo-100/70">Don't have an account?</p>
                                        <Link href="/register" className="inline-flex items-center font-semibold text-white hover:underline">
                                            Create an account
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>

                                {/* Right Side - Form (Adapts to Dark/Light) */}
                                <div className="bg-card p-8 lg:p-12">
                                    <div className="mx-auto max-w-md">
                                        <div className="mb-8 text-center">
                                            <h1 className="mb-2 text-3xl font-bold text-foreground">Sign In</h1>
                                            <p className="text-muted-foreground">Welcome back! Please login to your account.</p>
                                        </div>

                                        <LoginForm />

                                        {/* Divider */}
                                        <div className="my-8 flex items-center">
                                            <div className="flex-1 border-t border-border" />
                                            <span className="px-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Or continue with
                                            </span>
                                            <div className="flex-1 border-t border-border" />
                                        </div>

                                        {/* Social Login Buttons */}
                                        <div className="mb-6 grid grid-cols-2 gap-4">
                                            <SocialButton label="Google">
                                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                                    <path
                                                        fill="#4285F4"
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    />
                                                    <path
                                                        fill="#34A853"
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    />
                                                    <path
                                                        fill="#FBBC05"
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    />
                                                    <path
                                                        fill="#EA4335"
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    />
                                                </svg>
                                            </SocialButton>

                                            <SocialButton label="Facebook">
                                                <svg className="mr-2 h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </SocialButton>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">
                                                Don't have an account?{' '}
                                                <Link href="/register" className="font-semibold text-primary transition-colors hover:text-primary/80">
                                                    Sign up
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontPageLayout>
    );
};

// Helper for Social Buttons to maintain clean code
const SocialButton = ({ children, label }) => (
    <button
        type="button"
        className="flex items-center justify-center rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
    >
        {children}
        <span>{label}</span>
    </button>
);

export default BanalaiLogin;
