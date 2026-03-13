import { UserCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../animate-ui/radix/accordion';
import AvatarLogoFallback from '../Avatar/AvatarLogoFallback';

type TeamMember = {
    name: string;
    name_kh?: string;
    role: string;
    image?: string;
    description: string;
};

type TeamAccordionProps = {
    members: TeamMember[];
    multiple?: boolean;
    defaultValue?: string;
};

export const TeamAccordion = ({ members, defaultValue }: TeamAccordionProps) => {
    return (
        <Accordion type="single" defaultValue={defaultValue} collapsible className="my-4 w-full max-w-full gap-0">
            {members.map((member, index) => (
                <AccordionItem
                    key={index}
                    value={`${member.name}`}
                    className="overflow-hidden border border-b-0 px-4 first:rounded-t-md last:rounded-b-md last:border-b"
                >
                    <AccordionTrigger>{member.name}</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex items-start gap-3 sm:gap-4 rounded-lg sm:mx-0">
                            <AvatarLogoFallback
                                className="mt-1.5 aspect-[3/3.5] h-auto w-20 shrink-0 rounded-sm bg-muted sm:w-26"
                                imageClassName="size-full object-cover "
                                image={member.image || ''}
                                alt={member.name}
                                fallbackNode={<UserCircle2 className="size-2/5 text-muted-foreground" strokeWidth={1.5} />}
                            />
                            <div className="flex flex-col gap-1">
                                {member.name_kh ? (
                                    <p className='flex flex-col sm:flex-row flex-wrap'>
                                        <span className="mr-1 font-bold tracking-tight text-foreground text-lg">{member.name_kh}</span>
                                        <span className="text-lg tracking-tight text-muted-foreground">({member.name})</span>
                                    </p>
                                ) : (
                                    <p className="mr-1 font-bold tracking-tight text-foreground text-lg">{member.name}</p>
                                )}

                                <p className="flex flex-wrap gap-2 text-sm font-medium text-muted-foreground sm:text-base">{member.role}</p>
                                <p className="hidden max-w-[72ch] text-sm text-muted-foreground sm:block sm:text-base">{member.description}</p>
                            </div>
                        </div>
                        <p className="max-w-[72ch] text-sm text-muted-foreground sm:hidden mt-2 sm:text-base">{member.description}</p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};
