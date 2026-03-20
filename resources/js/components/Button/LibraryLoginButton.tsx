import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { Button } from '../ui/button';

const LibraryLoginButton = () => {
    const { t } = useTranslation();
    return (
        <Link href={'/bannalai-login'}>
            <Button>{t('Login')}</Button>
        </Link>
    );
};

export default LibraryLoginButton;
