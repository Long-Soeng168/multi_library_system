import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePage } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import { styled } from 'styled-components';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
const BookCardHoverGradient = ({
    badgeText,
    title,
    subTitle,
    image_url,
}: {
    badgeText?: string;
    title?: string;
    subTitle?: string;
    image_url?: string;
}) => {
    const { name, app_url } = usePage<any>().props;

    return (
        <StyledWrapper className="h-full">
            <div className="relative h-full">
                <div className="btn group relative z-10 h-full w-full overflow-hidden rounded-md border-2 border-background shadow hover:translate-[-8px] hover:border-transparent active:hover:translate-0 dark:border-border dark:hover:border-transparent">
                    <div className="flex h-full w-full flex-col border-none bg-background text-foreground">
                        <div className="group relative aspect-[7/10] w-full overflow-hidden rounded-sm bg-card transition-all duration-500 ease-out dark:shadow-primary/5">
                            <Avatar className="h-full w-full rounded-none border-none">
                                <AvatarImage
                                    src={image_url}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={title}
                                />
                                <AvatarFallback className="relative flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-none bg-zinc-50 p-4 dark:bg-zinc-950">
                                    <div className="z-10 flex w-full flex-col gap-2 border-l-2 border-primary pl-4">
                                        <span className="text-[8px] leading-none font-semibold tracking-[0.3em] text-foreground text-muted-foreground uppercase">
                                            Available at
                                        </span>
                                        <span className="font-serif text-[10px] tracking-wide text-foreground italic">{name}</span>
                                    </div>

                                    {/* 3. The Title Block - Bold Modern Sans */}
                                    <div className="z-10 w-full">
                                        <h3 className="line-clamp-4 text-2xl leading-[0.95] font-black tracking-tighter text-foreground uppercase">
                                            {title}
                                        </h3>
                                        <div className="mt-8 flex items-center gap-4">
                                            <div className="h-[1px] flex-1 bg-border" />
                                            {/* <span className="shrink-0 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"></span> */}
                                        </div>
                                    </div>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* <img src={image_url} alt={title} className="aspect-[7/10] w-full border-b bg-transparent object-cover" /> */}
                        <div className="flex flex-1 flex-col justify-between">
                            <div className="p-2 pb-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="w-full text-start">
                                                <p className="line-clamp-3 text-base leading-normal font-medium text-foreground">
                                                    {title}
                                                    {subTitle && (
                                                        <span className="text-sm leading-normal text-muted-foreground">
                                                            {' - '} {subTitle}
                                                        </span>
                                                    )}
                                                </p>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="w-[var(--radix-tooltip-trigger-width)] max-w-none bg-true-primary text-true-primary [&_svg]:bg-true-primary [&_svg]:text-true-primary"
                                            side="top"
                                        >
                                            <p className="text-base leading-normal text-primary-foreground dark:text-white">{title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        {/* <div className="flex flex-wrap gap-2 p-2">
                            <Badge variant="secondary" className="rounded-xs">
                                ធនាគារ និងហិរញ្ញវត្ថុ
                            </Badge>
                        </div> */}
                    </div>
                    <div className="absolute right-2 bottom-2 flex size-5 translate-x-6 items-center justify-center rounded bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:scale-150">
                        <ChevronRightIcon className="size-5 font-bold" />
                    </div>
                </div>
                <div className="absolute inset-0 z-0 h-full w-full rounded-lg border border-dashed border-foreground"></div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .btn {
        display: flex;
        justify-content: center;
        overflow: hidden;
        background-size: 300% 300%;
        cursor: pointer;
        backdrop-filter: blur(1rem);
        transition: 0.5s;
        background-origin: border-box;
        background-clip: content-box, border-box;
    }
    .btn:hover {
        animation: gradient_301 2s ease infinite;
        background-image: linear-gradient(#212121, #212121), linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%);
    }

    @keyframes gradient_301 {
        0% {
            background-position: 0% 50%;
        }

        50% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0% 50%;
        }
    }
`;

export default BookCardHoverGradient;
