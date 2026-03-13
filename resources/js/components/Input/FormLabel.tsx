import { Label } from '@/components/ui/label';
import useTranslation from '@/hooks/use-translation';
import * as React from 'react';

interface FormLabelProps {
    id?: string;
    label: string;
    required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({ id, label, required = false }) => {
    const { t } = useTranslation();
    return (
        <Label htmlFor={id} className={`text-start`}>
            {t(label)}
            {required && <span className="text-red-400">*</span>}
        </Label>
    );
};
