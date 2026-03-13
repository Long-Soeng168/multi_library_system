import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProgressWithValue } from '../ProgressBar/progress-with-value';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

interface AlertFlashMessageProps {
    flashMessage: string;
    type?: 'success' | 'warning' | 'error' | 'message' | string;
    title?: string;
    showProgress?: boolean;
    setFlashMessage: React.Dispatch<
        React.SetStateAction<{
            message: string;
            type: string;
        }>
    >;
}

export default function AlertFlashMessage({ flashMessage, setFlashMessage, type = 'message', title, showProgress = true }: AlertFlashMessageProps) {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    const DURATION = 3000; // 3 seconds
    const INTERVAL = 50; // 50ms per progress update

    // Ensure type fallback
    const alertType = ['success', 'warning', 'error', 'message'].includes(type) ? type : 'message';

    const colorMap = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/30',
            text: 'text-green-600 dark:text-green-400',
            border: 'hover:border-green-600 dark:hover:border-green-400',
            icon: CheckCircleIcon,
            progressBg: 'bg-green-600/30 dark:bg-green-400/30',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/30',
            text: 'text-yellow-600 dark:text-yellow-400',
            border: 'hover:border-yellow-600 dark:hover:border-yellow-400',
            icon: AlertTriangleIcon,
            progressBg: 'bg-yellow-600/30 dark:bg-yellow-400/30',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400',
            border: 'hover:border-red-600 dark:hover:border-red-400',
            icon: XIcon,
            progressBg: 'bg-red-600/30 dark:bg-red-400/30',
        },
        message: {
            bg: 'bg-primary/10 dark:bg-primary/20',
            text: 'text-primary dark:text-primary-light',
            border: 'hover:border-primary dark:hover:border-primary-light',
            icon: InfoIcon,
            progressBg: 'bg-primary/30 dark:bg-primary-light/30',
        },
    };

    const { bg, text, border, icon: Icon, progressBg } = colorMap[alertType];

    useEffect(() => {
        if (!flashMessage) return;

        setVisible(true);
        setProgress(0);

        let elapsed = 168;
        const interval = setInterval(() => {
            elapsed += INTERVAL;
            setProgress(Math.min((elapsed / DURATION) * 100, 100));
        }, INTERVAL);

        const timeout = setTimeout(() => handleRemoveMessage(), DURATION);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [flashMessage]);

    const handleRemoveMessage = () => {
        setFlashMessage({ message: '', type: 'message' });
        setVisible(false);
        setProgress(0);
    };

    if (!flashMessage || !visible) return null;

    return (
        <div>
            <Alert className={`flex items-center justify-between rounded-none border-none ${bg} pr-2 [&>svg+div]:translate-y-0`}>
                <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-4 w-4 ${text}`} />
                    <div className="flex-col justify-center">
                        <AlertTitle className={text}>{title || alertType.charAt(0).toUpperCase() + alertType.slice(1)}</AlertTitle>
                        <AlertDescription className={text}>{flashMessage}</AlertDescription>
                    </div>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`border border-transparent pl-0 hover:bg-transparent ${border} ${text} hover:${text}`}
                    onClick={handleRemoveMessage}
                >
                    <XIcon className="h-5 w-5" />
                </Button>
            </Alert>

            {showProgress && (
                <ProgressWithValue className={`relative h-[4px] rounded-none ${progressBg}`} label={() => null} value={progress} position="start" />
            )}
        </div>
    );
}
