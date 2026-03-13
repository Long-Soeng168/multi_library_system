import { useEffect, useState, useRef } from 'react';
import NavbarDataForHideAndShow from './NavbarDataForHideAndShow';

export default function NavbarHideAndShow() {
    const [show, setShow] = useState(false);
    const lastScrollY = useRef(0);
    const MAIN_NAV_HEIGHT = 200;

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            let newShow = show;

            if (currentScrollY < MAIN_NAV_HEIGHT) {
                newShow = false;
            } else {
                if (currentScrollY > lastScrollY.current) {
                    // scrolling down
                    newShow = false;
                } else {
                    // scrolling up
                    newShow = true;
                }
            }

            // only update state if it actually changes
            if (newShow !== show) setShow(newShow);

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', controlNavbar, { passive: true });
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [show]);

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full border-b border-border bg-background transition-transform duration-300 ease-in-out ${
                show ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <NavbarDataForHideAndShow />
        </nav>
    );
}
