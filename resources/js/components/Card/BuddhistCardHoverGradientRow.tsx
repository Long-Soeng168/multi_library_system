import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import { styled } from 'styled-components';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HtmlContentDisplay from '../Typography/HtmlContentDisplay';

const BuddhistCardHoverGradientHover = ({ item }: { item?: any }) => {
    
    const { t, currentLocale } = useTranslation();
    return (
        <StyledWrapper>
            <Link href={`/posts/${item.id}`}>
                <div className="card group flex h-[200px] w-full cursor-pointer overflow-hidden rounded-md">
                    <div className="card__glow" />
                    {/* Image Left */}
                    <Avatar className="card__image h-auto w-1/3 border border-muted">
                        <AvatarImage
                            className="h-full w-full object-cover"
                            src={`/images/thumb/${item.thumbnail}`}
                            alt={currentLocale === 'kh' ? item?.title_kh || item?.title : item?.title}
                        />
                        <AvatarFallback className="flex items-center justify-center rounded-none bg-[#961c1e]/10">
                            <img src="/assets/buddhist/logo.webp" alt="Logo" className="w-20 dark:hidden" />
                            <img src="/assets/buddhist/colored-logo.png" alt="Logo" className="hidden w-20 dark:block" />
                        </AvatarFallback>
                    </Avatar>

                    {/* Text Right */}
                    <div className="relative flex flex-1 flex-col justify-between p-5">
                        <div className="card__text">
                            <p className="card__title pb-2 text-lg font-medium">
                                {currentLocale === 'kh' ? item?.title_kh || item?.title : item?.title}
                            </p>
                            <HtmlContentDisplay
                                className="line-clamp-4 prose-p:!m-0 prose-p:!text-start prose-p:text-muted-foreground"
                                isRemoveImage={true}
                                isRemoveAllStyles={true}
                                isRemoveAllEmptyTags={true}
                                content={currentLocale === 'kh' ? item?.short_description_kh || item?.short_description : item?.short_description}
                            />
                        </div>
                    </div>
                    <div className="card__button absolute right-5 bottom-5 size-6 translate-x-10 bg-true-primary opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:ring-[5px] group-hover:ring-primary/20">
                        <ChevronRightIcon />
                    </div>
                </div>
            </Link>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .card {
        display: flex;
        background: var(--background);
        overflow: hidden;
        position: relative;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .card__glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0) 70%);
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    .card__image {
        overflow: hidden;
        transition: all 0.5s ease;
    }

    .card__text {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }

    .card__title {
        color: var(--forground);
        margin: 0;
        transition: all 0.3s ease;
    }

    .card__button {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        transform: scale(0.9);
    }

    .card:hover .card__glow {
        opacity: 1;
    }

    .card:hover .card__image {
        transform: scale(1.03);
        box-shadow: 0 10px 10px -3px rgba(0, 0, 0, 0.1);
    }

    .card:hover .card__button svg {
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
`;

export default BuddhistCardHoverGradientHover;
