import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCustomLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6 ">
                <div className="flex flex-col gap-6 ">
                    <Card className="rounded-xl border border-primary shadow-none">
                        <Link
                            href={`/`}
                            className="flex cursor-pointer max-w-20 max-h-20 items-center gap-2 self-center overflow-hidden rounded-full border border-transparent font-medium duration-300 hover:scale-110 hover:border-primary"
                        >
                            <AppLogoIcon />
                        </Link>
                        <CardContent className="px-10 py-4">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
