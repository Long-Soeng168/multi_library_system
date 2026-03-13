import { SheetLogo } from '@/components/Logo/SheetLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AlignLeftIcon } from 'lucide-react';
import { NavMenu } from './NavMenu';

export const NavSheet = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <AlignLeftIcon />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full">
                <div className="h-full w-full overflow-y-scroll p-4">
                    <SheetLogo />
                    <div className="h-8"></div>
                    <NavMenu orientation="vertical" />
                    {/* <div className='flex justify-center'>
                        <NavLogin />
                    </div> */}
                </div>
            </SheetContent>
        </Sheet>
    );
};
