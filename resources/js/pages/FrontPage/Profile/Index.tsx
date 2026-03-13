import LibraryFeatureCards from '@/components/Card/LibraryFeatureCards';
import MembershipCard from '@/components/Card/MembershipCard';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Link } from '@inertiajs/react';
import { ArrowRightIcon, InfoIcon, QrCodeIcon } from 'lucide-react';

const Index = () => {
    return (
        <FrontPageLayout>
            <div className="section-container relative py-4">
                <div className="flex justify-center">
                    <MembershipCard />
                </div>
                <div className="mx-auto mt-4 grid max-w-lg grid-cols-1">
                    <Card className="relative overflow-hidden border-border p-0 shadow-none transition hover:border-primary/50">
                        <CardHeader className="p-5">
                            <div className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <QrCodeIcon className="size-10 text-primary" />
                                <Link href={`/scan-qr`}>
                                    <Button className="gap-2 rounded-sm" variant="default">
                                        Start Scan
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
                                <CardDescription>Scan QR code to check in</CardDescription>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="group inline-flex translate-y-1 items-center gap-1 text-sm font-medium text-primary hover:underline"
                                >
                                    <InfoIcon className="h-4 w-4 transition-transform group-hover:rotate-12" />
                                    How it works
                                </button>
                            </div>
                        </CardHeader>
                    </Card>
                    <LibraryFeatureCards />
                </div>
            </div>
        </FrontPageLayout>
    );
};

export default Index;
