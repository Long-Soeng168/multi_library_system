import * as React from 'react';
import CheckboxSelect from '../Section/CheckboxSelect';
import { FormErrorLabel } from './FormErrorLabel';
import { FormLabel } from './FormLabel';

interface FormCheckboxSelectProps {
    id?: string;
    name: string;
    label: string;
    options: { value: string; label: string }[];
    value: string[];
    onChange: (vals: string[]) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

export const FormCheckboxSelect: React.FC<FormCheckboxSelectProps> = ({
    id,
    name,
    label,
    options,
    value,
    onChange,
    error,
    required = false,
    className,
}) => {
    return (
        <div className={`grid content-start gap-2 ${className || ''}`}>
            <FormLabel id={id} label={label} required={required} />
            <CheckboxSelect name={name} options={options} value={value} onChange={onChange} />
            <FormErrorLabel error={error} />
        </div>
    );
};
