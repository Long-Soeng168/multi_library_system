import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { useState } from 'react';

const YearSlider = () => {
    const [values, setValues] = useState([2000, 2025]);

    return (
        <div className="w-full py-4">
            <DualRangeSlider label={(value) => <span>{value}</span>} value={values} onValueChange={setValues} min={2000} max={2025} step={1} />
        </div>
    );
};
export default YearSlider;
