import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import { List } from 'lucide-react';
import { PromoContent } from './promo-content';
import { TableOfContents } from './table-of-contents';

export function MobileTableOfContents() {
    return (
        <Drawer>
            <DrawerTrigger className="fixed border right-3.5 bottom-30 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 lg:hidden">
                <List size={20} />
            </DrawerTrigger>

            <DrawerContent className="lg:hidden z-1000">
                <DrawerHeader>
                    <p className="font-semibold">Table of Contents</p>
                </DrawerHeader>

                <DrawerBody>
                    <TableOfContents />
                </DrawerBody>

                <DrawerFooter>
                    <PromoContent variant="mobile" />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
