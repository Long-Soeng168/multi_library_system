import { ChevronRight } from 'lucide-react';

import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export function AnimatedGradientTextBadge({ label = 'About Us' }) {
    const { t } = useTranslation();
    return (
        <div className="group relative mx-auto flex  w-fit items-center active:ring-2 hover:ring-4 ring-primary/10  justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
                className={cn(
                    'absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]',
                )}
                style={{
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'destination-out',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'subtract',
                    WebkitClipPath: 'padding-box',
                }}
            />
            🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-primary/50" />
            <AnimatedGradientText className="text-sm font-medium">{t(label)}</AnimatedGradientText>
            <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </div>
    );
}
