import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { CircleAlert } from 'lucide-react';
import * as React from 'react';

interface FormErrorLabelProps {
    error?: string;
    className?: string;
}

export const FormErrorLabel: React.FC<FormErrorLabelProps> = ({ error, className }) => {
    const { t } = useTranslation();
    if (!error) return null;
    return (
        <p className={cn('flex items-center gap-1 text-sm text-destructive', className)}>
            <CircleAlert size={14} />
            {error}
        </p>
    );
};
