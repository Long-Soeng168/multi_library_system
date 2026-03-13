import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/animate-ui/radix/accordion';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';

export default function Accordion1() {
    const { faqData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    return (
        <Accordion type="single" defaultValue="item-1" collapsible className="mx-auto w-full max-w-[800px]">
            {faqData?.map((item: any, idx: number) => {
                const question = currentLocale === 'kh' ? item?.question_kh || item?.question : item?.question;
                const answer = currentLocale === 'kh' ? item?.answer_kh || item?.answer : item?.answer;

                return (
                    <AccordionItem key={idx} value={`item-${idx+1}`}>
                        <AccordionTrigger>{question}</AccordionTrigger>
                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
