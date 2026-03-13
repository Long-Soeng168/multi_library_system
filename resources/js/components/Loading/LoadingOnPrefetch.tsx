import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Spinner } from '../ui/spinner';

const LoadingOnPrefetch = () => {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const start = router.on('start', () => setLoading(true));
        const finish = router.on('finish', () => setLoading(false));

        return () => {
            start();
            finish();
        };
    }, []);
    return (
        <>
            {loading && (
                <div className="flex h-full w-full items-center justify-center">
                    <span className="flex animate-pulse items-center gap-2 text-sm text-primary">
                        <Spinner /> {t('Loading...')}
                    </span>
                </div>
            )}
        </>
    );
};

export default LoadingOnPrefetch;
