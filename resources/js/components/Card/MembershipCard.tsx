import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import BarcodeLib from 'react-barcode';
import { BorderBeam } from '../ui/border-beam';
import { FlickeringGrid } from '../ui/flickering-grid';

export default function MembershipCard() {
    // Example member object:
    let member = {
        name: 'Long Soeng',
        name_kh: 'ឡុង សឹង',
        email: 'longsoeng@gmail.com',
        phone: '012 230 715 24',
        gender: 'Male',
        address: 'Phnom Penh, Sensok ',
        memberId: 'LB-000123',
        joinDate: '2023-07-15',
        expireDate: '2026-07-15',
        avatar: 'https://github.com/shadcn.png',
        barcodeValue: '153000501',
    };

    const { website_info } = usePage<any>().props;
    const { currentLocale } = useTranslation();

    const logo = website_info?.logo ? `/assets/images/website_infos/thumb/${website_info.logo}` : '/assets/images/default-logo.png';

    const logoDark = website_info?.logo_darkmode ? `/assets/images/website_infos/thumb/${website_info.logo_darkmode}` : logo;

    const name = currentLocale === 'kh' ? website_info?.name_kh || website_info?.name : website_info?.name;

    return (
        <Card className="relative w-full max-w-lg overflow-hidden rounded-2xl border-primary/30 bg-background py-0 shadow-none">
            {/* <img src={logo} alt="" className="absolute top-4 left-1/2 z-0 size-44 -translate-x-1/2 object-contain opacity-15" /> */}

            <BorderBeam duration={8} size={200} borderWidth={1.5} />
            {/* Content */}
            <CardContent className="z-10 p-5">
                {/* Avatar + Name */}
                <div className="absolute top-0 right-0 left-0 h-20 fill-primary">
                    <div className="relative h-[200px] translate-x-[3px] translate-y-[3px] w-full overflow-hidden rounded-lg mask-[linear-gradient(to_top,transparent_25%,black_95%)]">
                        <FlickeringGrid
                            className="absolute inset-0 z-0 size-full"
                            squareSize={4}
                            gridGap={6}
                            color="#655eb3"
                            maxOpacity={0.5}
                            flickerChance={0.1}
                            height={200}
                            width={512}
                        />
                    </div>
                </div>

                {/* <div className="absolute top-0 right-0 left-0 h-22 bg-primary"></div> */}
                <div className="relative flex w-full flex-col items-start justify-between gap-3">
                    <div className="flex w-full flex-col items-center justify-center gap-2 pt-4">
                        <Avatar className="size-32 rounded-full border object-cover dark:border-white/20">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="rounded-none">{member.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="my-4 flex flex-col items-center gap-2">
                            {/* <div className="text-2xl leading-none font-semibold text-foreground">{member.name_kh}</div> */}
                            <div className="text-lg leading-none font-medium text-foreground">{member.name}</div>
                        </div>
                    </div>
                    {/* <div className="flex w-full flex-1 flex-col justify-start gap-1">
                        <div className="flex items-center gap-1 text-base text-foreground">
                            <div className="min-w-[55px] shrink-0 font-medium">ទូរស័ព្ទ</div>: {member.phone}
                        </div>
                        <div className="flex items-center gap-1 text-base text-foreground">
                            <div className="min-w-[55px] shrink-0 font-medium">អ៊ីមែល</div>: {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-base text-foreground">
                            <div className="min-w-[55px] shrink-0 font-medium">និស្សិត</div>: បរិញ្ញាបត្រ
                            <div className="mx-4 h-3.5 w-[1.5px] bg-muted-foreground"></div> ផ្នែក : នីតិសាស្រ្ត
                        </div>
                        <div className="mt-4 flex w-full flex-col items-center">
                            <div className="text-xs font-medium">Expired</div>
                            <div className="flex w-full items-center justify-center gap-1 text-sm">{member.expireDate}</div>
                        </div>
                    </div> */}
                </div>

                {/* Barcode */}
                <div className="000justify-center flex flex-col items-center py-5">
                    <div className="bg-white">
                        <BarcodeLib
                            value={member.barcodeValue}
                            width={1.6}
                            height={55}
                            displayValue={false}
                            lineColor="#334155"
                            background="transparent"
                        />
                    </div>

                    <p>{member.barcodeValue}</p>
                </div>

                <p className="mt-2 text-center text-xs text-muted-foreground">Please present this card when visiting the library.</p>
            </CardContent>
        </Card>
    );
}
