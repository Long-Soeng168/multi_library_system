import LibraryLoginButton from '../Button/LibraryLoginButton';
import { NavbarLogo2 } from '../Logo/NavbarLogo2';
import { SheetLogo } from '../Logo/SheetLogo';
import { SwitchDarkModeSmoothAnimated } from '../Switch/SwitchDarkModeSmoothAnimated';
import NavLanguage from './NavLanguage';
import { NavMenu2 } from './NavMenu2';
import { NavSheet } from './NavSheet';

const Navbar2 = () => {
    return (
        <>
            {/* Start Top Navbar */}
            <div className="min-[1000px]:border-b">
                <div className="section-container mx-auto w-full py-2 min-[1000px]:py-4">
                    <div className="flex h-full items-center justify-between">
                        <span className="hidden min-[1000px]:inline-block">
                            <NavbarLogo2 />
                        </span>

                        <div className="flex gap-4 max-[1000px]:hidden">
                            <NavMenu2 />
                            <div className="flex items-center gap-3">
                                {/* <LibrarySearchSheet /> */}
                                <LibraryLoginButton />
                                <SwitchDarkModeSmoothAnimated />
                                <NavLanguage />

                                {/* Start Mobile Menu */}
                                <div className="hidden max-[1000px]:block">
                                    <NavSheet />
                                </div>
                                {/* End Mobile Menu */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Top Navbar */}

            {/* Start Bottom Navbar */}
            <div className="z-30 mx-auto w-full border-b bg-background pb-4 min-[1000px]:hidden">
                <nav className="section-container">
                    <div className="flex h-full items-center justify-between">
                        <div>
                            <SheetLogo />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* <LibrarySearchSheet /> */}
                            <LibraryLoginButton />
                            <SwitchDarkModeSmoothAnimated />
                            <NavLanguage />

                            {/* Start Mobile Menu */}
                            <div className="hidden max-[1000px]:block">
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

export default Navbar2;
