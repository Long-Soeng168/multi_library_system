import * as React from 'react';
import RadioSelect from '../Section/RadioSelect';
import { FormErrorLabel } from './FormErrorLabel';
import { FormLabel } from './FormLabel';

interface FormRadioSelectProps {
    id?: string;
    name: string;
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (val: string) => void;
    error?: string;
    required?: boolean;
    className?: string;
}

export const FormRadioSelect: React.FC<FormRadioSelectProps> = ({
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
            <FormLabel id={id || name} label={label} required={required} />
            <RadioSelect name={name} options={options} value={value} onChange={onChange} />
            <FormErrorLabel error={error} />
        </div>
    );
};
