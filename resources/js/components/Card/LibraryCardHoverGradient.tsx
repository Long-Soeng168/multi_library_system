import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { ChevronRightIcon, ImageOff, MapPinIcon } from 'lucide-react';
import { styled } from 'styled-components';
import { Badge } from '../ui/badge';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LibraryCardHoverGradient = ({ item }: { item?: any }) => {
    
    
    const { t, currentLocale } = useTranslation();
    return (
        <StyledWrapper>
            <Link href={`/libraries/${item.id}`}>
                <div className="card group h-full w-full cursor-pointer">
                    <div className="card__glow" />
                    <div className="card__content">
                        {/* {badgeText && <div className="card__badge">{badgeText}</div>} */}
                        <Avatar className="card__image aspect-video size-auto w-full bg-primary/20">
                            <AvatarImage
                                className="card__image aspect-video w-full rounded-none bg-primary/20"
                                src={`/assets/images/library_data/thumb/${item.banner}`}
                                alt={item.name_of_library}
                            />
                            <AvatarFallback className="aspect-video w-full rounded-none bg-muted">
                                <ImageOff className="size-10 text-primary opacity-50" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 flex-col justify-between">
                            <div className="card__text">
                                <p className="card__title font-medium">{item.name_of_library}</p>
                                {/* <p className="card__description">{subTitle}</p> */}
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline">
                                        {currentLocale === 'kh' ? item?.funding_type?.name_kh || item?.funding_type?.name : item?.funding_type?.name}
                                    </Badge>
                                    <Badge variant="outline">
                                        {currentLocale === 'kh' ? item?.class_type?.name_kh || item?.class_type?.name : item?.class_type?.name}
                                    </Badge>
                                    <Badge variant="outline" className="block max-w-full overflow-hidden">
                                        <span className="block truncate">
                                            {currentLocale === 'kh'
                                                ? item?.library_type?.name_kh || item?.library_type?.name
                                                : item?.library_type?.name}
                                        </span>
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPinIcon size={18} />
                                    {currentLocale === 'kh' ? item?.province?.name_kh || item?.province?.name : item?.province?.name}
                                </p>
                            </div>
                        </div>
                        <div className="card__button absolute right-5 bottom-5 size-6 translate-x-10 bg-true-primary opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:ring-[5px] group-hover:ring-primary/20">
                            <ChevronRightIcon />
                        </div>
                        {/* <div className="card__footer">
                        <div className="card__price"></div>
                        <div className="card__button size-7 bg-true-primary group-hover:ring-[5px] group-hover:ring-primary/20">
                            <ChevronRightIcon />
                        </div>
                    </div> */}
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
        box-shadow: var(--card-shadow);
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
        transform: translateY(-10px);
        box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border-color: rgba(124, 58, 237, 0.2);
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
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
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

export default LibraryCardHoverGradient;
