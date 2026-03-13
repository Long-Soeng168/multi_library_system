import useTranslation from '@/hooks/use-translation';
import { ChevronRightIcon } from 'lucide-react';
import { styled } from 'styled-components';

const HoverButton2 = ({ title = 'See More' }: { title?: string }) => {
    const { t } = useTranslation();

    return (
        <StyledWrapper>
            <button className="cta flex items-center text-primary before:bg-true-primary/20 before:opacity-20 dark:before:opacity-50 dark:before:bg-true-primary">
                <span>{t(title)}</span>
                <ChevronRightIcon />
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .cta {
        position: relative;
        margin: auto;
        padding: 10px 10px 10px 20px;
        transition: all 0.2s ease;
        border: none;
        background: none;
        cursor: pointer;
    }

    .cta:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        border-radius: 50px;
        width: 45px;
        height: 45px;
        transition: all 0.3s ease;
    }

    .cta span {
        position: relative;
        font-family: 'Ubuntu', sans-serif;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .cta svg {
        position: relative;
        top: 0;
        margin-left: 10px;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
        transform: translateX(-5px);
        transition: all 0.3s ease;
    }

    .cta:hover:before {
        width: 100%;
    }

    .cta:hover svg {
        transform: translateX(0);
    }

    .cta:active {
        transform: scale(0.95);
    }
`;

export default HoverButton2;
