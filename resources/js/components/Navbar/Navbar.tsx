import { NavbarLogo } from '@/components/Logo/NavbarLogo';

import LibrarySearchSheet from '../Search/LibrarySearchSheet';
import NavLanguage from './NavLanguage';
import NavLogin from './NavLogin';
import { NavMenu } from './NavMenu';
import { NavSheet } from './NavSheet';

const Navbar = () => {
    return (
        <>
            {/* Start Top Navbar */}
            <div className="section-container mx-auto mt-4 w-full">
                <div className="flex h-full items-center justify-between">
                    <NavbarLogo />

                    <div className="max-[650px]:hidden">
                        <NavLogin />
                    </div>
                </div>
            </div>
            {/* End Top Navbar */}

            {/* Start Bottom Navbar */}
            <div className="sticky top-0 z-30 mx-auto w-full border-b bg-background/40 py-4 backdrop-blur-md">
                <nav className="section-container">
                    <div className="sticky top-0 flex h-full items-center justify-between">
                        {/* <NavbarLogo /> */}
                        <div className="max-[650px]:hidden">
                            <NavMenu />
                        </div>
                        <div className="hidden max-[650px]:block">
                            <NavLogin hideRegisterWhenSmall={true} />
                        </div>

                        <div className="flex items-center gap-3">
                            <LibrarySearchSheet />
                            <NavLanguage />

                            {/* Start Mobile Menu */}
                            <div className="hidden max-[650px]:block">
                                <NavSheet />
                            </div>
                            {/* End Mobile Menu */}
                        </div>
                    </div>
                </nav>
            </div>
            {/* End Bottom Navbar */}
        </>
    );
};

export default Navbar;
