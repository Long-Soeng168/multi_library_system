import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import { styled } from 'styled-components';
const thesisData = {
    title: 'Your Thesis Title Here',
    student: 'John Doe',
    supervisor: 'Jane Smith',
    details: {
        students: 'សាង សុជីវិត / ហួន សុណ្ណារ៉ា',
        advisor: 'ទេព សុខ',
        year: 2023,
        category: 'នីតិសាស្ត្រ',
        pages: 120,
    },
};

const BookCardHoverGradientListLayout = ({
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
    
    
    return (
        <StyledWrapper>
            <div className="relative">
                <Link
                    href={`/resources/theses/1`}
                    className="btn group relative z-10 h-full w-full overflow-hidden rounded-md border-2 border-background shadow hover:translate-[-8px] hover:border-transparent active:hover:translate-0 dark:border-border dark:hover:border-transparent"
                >
                    <div className="flex h-[200px] w-full border-none bg-background text-foreground lg:h-[280px]">
                        <img src={image_url} alt={title} className="aspect-[7/10] h-full border-r bg-transparent object-cover" />
                        <div className="flex h-full flex-1 flex-col justify-between overflow-y-scroll [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
                            <div className="p-2">
                                <p className="line-clamp-6 text-sm leading-normal font-medium text-foreground lg:text-lg">
                                    {title}
                                </p>
                                {/* Right Column: Details */}
                                <div className="mt-2 max-w-sm text-[8px] lg:mt-4 lg:text-[14px]">
                                    {Object.entries(thesisData.details).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-start gap-2 pb-1 lg:gap-4">
                                            <span className="w-[40px] shrink-0 whitespace-nowrap lg:w-[80px]">
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </span>
                                            :<span className="">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-2 bottom-2 flex size-5 translate-x-6 items-center justify-center rounded bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:scale-150">
                        <ChevronRightIcon className="size-5 font-bold" />
                    </div>
                </Link>
                <div className="absolute inset-0 z-0 h-full w-full rounded-lg border border-dashed border-foreground"></div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
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

export default BookCardHoverGradientListLayout;
