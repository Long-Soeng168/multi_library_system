import { store } from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useTranslation from '@/hooks/use-translation';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

const LoginForm = () => {
    const { t } = useTranslation();
    const { status, canResetPassword } = usePage<{ status: any; canResetPassword: any }>().props;

    return (
        <div>
            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('Email address')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{t('Password')}</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            {t('Forgot password?')}
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={t('Password')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" defaultChecked name="remember" tabIndex={3} />
                                <Label htmlFor="remember">{t('Remember me')}</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {t('Login')}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t("Don't have an account?")}{' '}
                            <TextLink href={register()} tabIndex={5}>
                                {t('Sign up')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
};

export default LoginForm;
