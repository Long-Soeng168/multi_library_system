import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import { LoaderCircleIcon } from 'lucide-react';

interface SubmitButtonProps {
    processing: boolean;
    children?: any;
}

const SubmitButton = ({ processing, children, ...props }: SubmitButtonProps) => {
    const { t } = useTranslation();

    return (
        <div className='flex justify-end'>
            <Button disabled={processing} type="submit" className='h-11 px-6' {...props}>
                {processing && (
                    <span className="mr-2 size-6 animate-spin">
                        <LoaderCircleIcon />
                    </span>
                )}
                {processing ? t('Submitting') : children || t('Submit')}
            </Button>
        </div>
    );
};

export default SubmitButton;
