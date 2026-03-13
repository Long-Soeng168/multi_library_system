import { ChevronUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const ScrollToTopButton = () => {
    

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // No need for typeof window check here, useEffect never runs on server
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            {visible && (
                <StyledWrapper>
                    <button className="Btn bg-true-primary opacity-90 hover:opacity-100" onClick={scrollToTop}>
                        <div className="sign">
                            <ChevronUpIcon />
                        </div>
                        <div className="text whitespace-nowrap">Back to Top</div>
                    </button>
                </StyledWrapper>
            )}
        </>
    );
};

const StyledWrapper = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 50;

    .Btn {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 45px;
        height: 45px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition-duration: 0.3s;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    }

    .sign {
        width: 100%;
        transition-duration: 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sign svg {
        width: 28px;
        height: 28px;
        color: white;
    }

    .text {
        position: absolute;
        right: 0%;
        width: 0%;
        opacity: 0;
        color: white;
        font-size: 1em;
        font-weight: 600;
        transition-duration: 0.3s;
    }

    .Btn:hover {
        width: 150px;
        border-radius: 40px;
        transition-duration: 0.3s;
    }

    .Btn:hover .sign {
        width: 30%;
        transition-duration: 0.3s;
        padding-left: 6px;
    }

    .Btn:hover .text {
        opacity: 1;
        width: 70%;
        transition-duration: 0.3s;
        padding-right: 10px;
    }

    .Btn:active {
        transform: translate(2px, 2px);
    }
`;

export default ScrollToTopButton;
