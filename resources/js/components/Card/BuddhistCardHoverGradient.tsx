import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import { styled } from 'styled-components';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HtmlContentDisplay from '../Typography/HtmlContentDisplay';

const BuddhistCardHoverGradient = ({ item }: { item?: any }) => {
    
    
    const { t, currentLocale } = useTranslation();
    return (
        <StyledWrapper>
            <Link href={`/posts/${item.id}`}>
                <div className="card group h-auto max-h-[450px] w-full cursor-pointer">
                    <div className="card__glow" />
                    <div className="card__content">
                        {/* {badgeText && <div className="card__badge">{badgeText}</div>} */}
                        <Avatar className="card__image aspect-video size-auto w-full border border-muted">
                            <AvatarImage
                                className="aspect-video w-full rounded-none object-cover"
                                src={`/images/thumb/${item.thumbnail}`}
                                alt={currentLocale === 'kh' ? item?.title_kh || item?.title : item?.title}
                            />
                            <AvatarFallback className="aspect-video w-full rounded-none bg-[#961c1e]/10">
                                {/* <ImageOff className="size-10 text-primary opacity-30" /> */}
                                <img src="/assets/buddhist/logo.webp" alt="Logo" className="w-20 dark:hidden" />
                                <img src="/assets/buddhist/colored-logo.png" alt="Logo" className="hidden w-20 dark:block" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 flex-col justify-between">
                            <div className="card__text">
                                <p className="card__title pb-2 text-lg font-medium">
                                    {currentLocale === 'kh' ? item?.title_kh || item?.title : item?.title}
                                </p>
                                <p className="text-muted">
                                    <HtmlContentDisplay
                                        className="line-clamp-4 prose-p:!m-0 prose-p:!text-start prose-p:text-muted-foreground"
                                        isRemoveImage={true}
                                        isRemoveAllStyles={true}
                                        isRemoveAllEmptyTags={true}
                                        content={
                                            currentLocale === 'kh' ? item?.short_description_kh || item?.short_description : item?.short_description
                                        }
                                    />
                                </p>
                            </div>
                        </div>

                        {/* <div className="card__footer">
                        <div className="card__price"></div>
                        <div className="card__button size-7 bg-true-primary group-hover:ring-[5px] group-hover:ring-primary/20">
                            <ChevronRightIcon />
                        </div>
                    </div> */}
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
        --card-bg: var(--background);
        --card-accent: #655eb3;
        --card-text: var(--forground);
        --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);

        background: var(--card-bg);
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        // box-shadow: var(--card-shadow);
        border: 1px solid rgba(255, 255, 255, 0.0);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .card__glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0) 70%);
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    .card__content {
        padding: 1.25em;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.75em;
        position: relative;
        z-index: 2;
    }

    .card__badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #10b981;
        color: white;
        padding: 0.25em 0.5em;
        border-radius: 999px;
        font-size: 0.7em;
        font-weight: 600;
        transform: scale(0.8);
        opacity: 0;
        transition: all 0.4s ease 0.1s;
    }

    .card__image {
        border-radius: 12px;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
    }

    .card__text {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
    }

    .card__title {
        color: var(--card-text);
        margin: 0;
        transition: all 0.3s ease;
    }

    .card__description {
        color: var(--card-text);
        font-size: 0.75em;
        margin: 0;
        opacity: 0.7;
        transition: all 0.3s ease;
    }

    .card__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    .card__price {
        color: var(--card-text);
        font-weight: 700;
        font-size: 1em;
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

    /* Hover Effects */
    .card:hover {
        // transform: translateY(-10px);
        box-shadow:
            0 10px 15px -0px rgba(0, 0, 0, 0.1),
            0 5px 5px -0px rgba(0, 0, 0, 0.04);
        border-color: rgba(124, 58, 237, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .card:hover .card__shine {
        opacity: 1;
        animation: shine 3s infinite;
    }

    .card:hover .card__glow {
        opacity: 1;
    }

    .card:hover .card__badge {
        transform: scale(1);
        opacity: 1;
        z-index: 1;
    }

    .card:hover .card__image {
        transform: translateY(-5px) scale(1.03);
        box-shadow: 0 10px 10px -3px rgba(0, 0, 0, 0.1);
    }

    .card:hover .card__title {
        transform: translateX(2px);
    }

    .card:hover .card__description {
        opacity: 1;
        transform: translateX(2px);
    }

    .card:hover .card__price {
        color: var(--card-accent);
        transform: translateX(2px);
    }

    .card:hover .card__button svg {
        animation: pulse 1.5s infinite;
    }

    /* Active State */
    .card:active {
        transform: translateY(-5px) scale(0.98);
    }

    /* Animations */
    @keyframes shine {
        0% {
            background-position: -100% 0;
        }
        100% {
            background-position: 200% 0;
        }
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

export default BuddhistCardHoverGradient;
