import useTranslation from '@/hooks/use-translation';
import * as React from 'react';
import { Textarea } from '../ui/textarea';
import { FormDescription } from './FormDescription';
import { FormErrorLabel } from './FormErrorLabel';
import { FormLabel } from './FormLabel';
import { cn } from '@/lib/utils';

interface FormFieldTextAreaProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    value: string | number | readonly string[] | undefined;
    error?: string;
    onChange: (val: string) => void;
    className?: string;
    containerClassName?: string;
    required?: boolean;
    description?: string;
}

export const FormFieldTextArea: React.FC<FormFieldTextAreaProps> = ({
    id,
    name,
    label,
    placeholder,
    value,
    error,
    onChange,
    className,
    containerClassName,
    required = false,
    description,
}) => {
    const { t } = useTranslation();
    return (
        <div className={cn('grid content-start gap-2', containerClassName)}>
            <FormLabel id={id} label={label} required={required} />
            <Textarea
                id={id}
                name={name}
                placeholder={placeholder ? t(placeholder) : t(label)}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`dark:border-white/20 ${error ? 'border-destructive' : ''} ${className || ''}`}
            />
            {description && <FormDescription description={description} />}
            <FormErrorLabel error={error} />
        </div>
    );
};
