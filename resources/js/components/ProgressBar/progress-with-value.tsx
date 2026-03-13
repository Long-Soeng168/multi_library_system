import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface ProgressWithValueProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    position?: 'start' | 'start-outside' | 'follow' | 'end' | 'end-outside';
    label?: (value?: number | null) => React.ReactNode;
    valueClassName?: string;
}

const ProgressWithValue = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressWithValueProps>(
    ({ className, valueClassName, value, position = 'end', label, ...props }, ref) => {
        const valueCommonClass = cn('absolute -top-0.5 left-0 hidden h-fit w-full items-center px-1.5');

        const ProgressValue = () => (
            <span
                className={cn(
                    'hidden text-sm font-bold',
                    position === 'start-outside' && 'block text-primary',
                    position === 'follow' && cn(valueCommonClass, 'flex justify-end text-white'),
                    position === 'start' && cn(valueCommonClass, 'flex justify-start text-white'),
                    position === 'end' && cn(valueCommonClass, 'flex justify-end text-primary'),
                    position === 'end-outside' && 'block text-primary',
                    valueClassName,
                )}
            >
                {typeof label === 'function' ? label(value) : `${value}%`}
            </span>
        );

        return (
            <div className="flex items-center gap-2">
                {position === 'start-outside' && <ProgressValue />}
                <ProgressPrimitive.Root
                    ref={ref}
                    className={cn('relative h-4 w-full overflow-hidden rounded-full bg-primary/20', className)}
                    {...props}
                >
                    <ProgressPrimitive.Indicator
                        className="h-full w-full flex-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
                    >
                        {position === 'follow' && <ProgressValue />}
                    </ProgressPrimitive.Indicator>
                    {(position === 'start' || position === 'end') && <ProgressValue />}
                </ProgressPrimitive.Root>
                {position === 'end-outside' && <ProgressValue />}
            </div>
        );
    },
);
ProgressWithValue.displayName = 'ProgressWithValue';

export { ProgressWithValue };
