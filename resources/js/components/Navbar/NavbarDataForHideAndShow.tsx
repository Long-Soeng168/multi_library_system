import { NavbarLogo3 } from '../Logo/NavbarLogo3';
import { NavbarLogo4 } from '../Logo/NavbarLogo4';
import LibrarySearchSheet from '../Search/LibrarySearchSheet';
import { SwitchDarkModeSmoothAnimated } from '../Switch/SwitchDarkModeSmoothAnimated';
import NavLanguage from './NavLanguage';
import { NavMenu2 } from './NavMenu2';
import { NavSheet } from './NavSheet';

const NavbarDataForHideAndShow = () => {
    return (
        <>
            {/* Desktop view */}
            <div className="max-[1000px]:hidden min-[1000px]:border-b">
                <div className="section-container mx-auto w-full py-2">
                    <div className="flex h-full items-center justify-between">
                        <NavbarLogo3 />

                        {/* <div>
                            <NavMenu2 />
                        </div> */}
                        <div className="flex items-center gap-3">
                            <LibrarySearchSheet />
                            <SwitchDarkModeSmoothAnimated />
                            <NavLanguage />

                            {/* Start Mobile Menu */}
                            {/* <div className="hidden max-[1000px]:block">
                                <NavSheet />
                            </div> */}
                            {/* End Mobile Menu */}
                        </div>
                    </div>
                </div>
            </div>
            {/* End Desktop view */}

            {/* Mobile view */}
            <div className="sticky top-0 z-30 mx-auto w-full border-b bg-background/40 py-2 backdrop-blur-md min-[1000px]:hidden">
                <nav className="section-container">
                    <div className="sticky top-0 flex h-full items-center justify-between">
                        <div>
                            <NavbarLogo4 />
                        </div>

                        <div className="flex items-center gap-3">
                            <LibrarySearchSheet />
                            <SwitchDarkModeSmoothAnimated />
                            <NavLanguage />

                            {/* Start Mobile Menu */}
                            {/* <div className="hidden max-[1000px]:block">
                                <NavSheet />
                            </div> */}
                            {/* End Mobile Menu */}
                        </div>
                    </div>
                </nav>
            </div>
            {/* End Mobile view */}
        </>
    );
};

export default NavbarDataForHideAndShow;
