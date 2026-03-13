import useTranslation from '@/hooks/use-translation';
import { DownloadIcon } from 'lucide-react';
import { styled } from 'styled-components';

const DownloadButton = () => {
    const { t } = useTranslation();

    return (
        <StyledWrapper>
            <button className="button group w-full p-2">
                <span className="button_lg px-4 py-2 dark:bg-white">
                    <span className="button_sl" />
                    <span className="button_text flex items-center gap-2 text-true-primary group-hover:text-white group-focus:text-white group-active:text-white">
                        {/* <img src="/assets/icons/gif/download.gif" className="size-8" /> */}
                        <DownloadIcon />
                        <span className="flex-1 text-center">{t('Download')}</span>
                    </span>
                </span>
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .button {
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        border: none;
        background: none;
        color: #0f1923;
        cursor: pointer;
        position: relative;
        margin-bottom: 20px;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 14px;
        transition: all 0.15s ease;
    }

    .button::before,
    .button::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        left: 0;
        height: calc(50% - 5px);
        border: 1px solid var(--primary);
        transition: all 0.15s ease;
    }

    .button::before {
        top: 0;
        border-bottom-width: 0;
    }

    .button::after {
        bottom: 0;
        border-top-width: 0;
    }

    .button:active,
    .button:focus {
        outline: none;
    }

    .button:active::before,
    .button:active::after {
        right: 3px;
        left: 3px;
    }

    .button:active::before {
        top: 3px;
    }

    .button:active::after {
        bottom: 3px;
    }

    .button_lg {
        position: relative;
        display: block;
        color: #fff;
        overflow: hidden;
        box-shadow: inset 0px 0px 0px 1px transparent;
    }

    .button_lg::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 2px;
        // background-color: #0f1923;
    }
    .button_sl {
        display: block;
        position: absolute;
        top: 0;
        bottom: -1px;
        left: -8px;
        width: 0;
        background-color: var(--true-primary);
        transform: skew(-15deg);
        transition: all 0.2s ease;
    }

    .button_text {
        position: relative;
    }

    .button:hover {
        color: #0f1923;
    }

    .button:hover .button_sl {
        width: calc(100% + 15px);
    }

    .button:hover .button_lg::after {
        background-color: #fff;
    }
`;

export default DownloadButton;
