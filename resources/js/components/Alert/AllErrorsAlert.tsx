import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import { OctagonAlertIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AllErrorsAlertProps {
    title: string;
    errors: Record<string, string>;
}

export default function AllErrorsAlert({ title, errors }: AllErrorsAlertProps) {
    const [isVisible, setIsVisible] = useState(true);
    const errorMessages = Object.values(errors || {});
    const { t } = useTranslation();

    // Reset visibility whenever errors change
    useEffect(() => {
        if (errorMessages.length > 0) {
            setIsVisible(true);
        }
    }, [errorMessages.length]);

    if (!isVisible || errorMessages.length === 0) return null;

    return (
        <Alert variant="destructive" className="relative mb-4 flex items-start justify-between pr-2">
            <div className="flex w-full items-start">
                <OctagonAlertIcon className="mt-1 mr-2 h-4 w-4" />
                <div className="flex w-full flex-col">
                    <AlertTitle>{t(title)}</AlertTitle>
                    <AlertDescription>
                        <div className="mt-2 max-h-48 w-full overflow-y-scroll">
                            <ul className="ml-5 list-disc space-y-1 text-destructive">
                                {errorMessages.map((msg, idx) => (
                                    <li key={idx}>{msg}</li>
                                ))}
                            </ul>
                        </div>
                    </AlertDescription>
                </div>
            </div>
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-0 right-0 m-1 border border-none !pl-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsVisible(false)}
            >
                <XIcon className="h-5 w-5" />
            </Button>
        </Alert>
    );
}
