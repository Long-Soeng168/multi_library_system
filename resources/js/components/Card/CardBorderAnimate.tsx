import { styled } from 'styled-components';

const CardBorderAnimate = () => {
    
    
    return (
        <StyledWrapper>
            <div className="card after:bg-background border">
                <h2 className='text-foreground'>CARD</h2>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
    .card {
        width: 190px;
        height: 254px;
        position: relative;
        display: flex;
        place-content: center;
        place-items: center;
        overflow: hidden;
        border-radius: 20px;
    }

    .card h2 {
        z-index: 1;
        font-size: 2em;
    }

    .card::before {
        content: '';
        position: absolute;
        width: 100px;
        background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
        height: 130%;
        animation: rotBGimg 10s linear infinite;
        transition: all 0.2s linear;
    }

    @keyframes rotBGimg {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    .card::after {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: 15px;
    }
    /* .card:hover:before {
    background-image: linear-gradient(180deg, rgb(81, 255, 0), purple);
    animation: rotBGimg 3.5s linear infinite;
  } */
`;

export default CardBorderAnimate;
