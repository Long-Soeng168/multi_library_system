import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface FormDescriptionProps {
    description?: string;
    className?: string;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({ description, className }) => {
    const { t } = useTranslation();
    if (!description) return null;
    return <p className={cn('text-[0.8rem] text-muted-foreground', className)} dangerouslySetInnerHTML={{ __html: t(description) }} />;
};
