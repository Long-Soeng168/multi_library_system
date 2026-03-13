const CardHoverGradient2 = () => {
    return (
        <div className="group">
            <a
                href="#"
                className="block animate-background bg-gradient-to-r from-green-300 via-blue-600 to-red-300 bg-[length:_400%_400%] p-1 transition-all [animation-duration:_6s]"
            >
                <span className="block  bg-background px-10 py-4 text-lg font-medium transition-all duration-300 group-hover:bg-background/80">
                    {' '}
                    Hello there 👋{' '}
                </span>
            </a>
        </div>
    );
};

export default CardHoverGradient2;
