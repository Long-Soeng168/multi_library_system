import { Timeline } from '@/components/ui/timeline';
import FrontPageLayout from '@/layouts/FrontPageLayout';

export default function OurJourney() {
    const data = [
        {
            title: 'Early 2026',
            content: (
                <div>
                    <p className="mb-8 text-xs text-neutral-800 md:text-base dark:text-neutral-200">
                        Successfully launched the redesigned RULE-Library website with a modern interface, improved performance, and a more seamless
                        user experience. This phase focused on scalability, polish, and long-term maintainability.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/rule_library/our_journey/2026-1.png"
                            alt="Early 2026"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2026-2.png"
                            alt="Early 2026"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2026-3.png"
                            alt="Early 2026"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2026-4.png"
                            alt="Early 2026"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },

        {
            title: '2024 → 2025',
            content: (
                <div>
                    <p className="mb-8 text-xs text-neutral-800 md:text-base dark:text-neutral-200">
                        A major rebuilding phase focused on refactoring core systems, improving content workflows, and optimizing performance across
                        devices. This period prepared the platform for a complete visual and architectural refresh.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/rule_library/our_journey/2024-1.png"
                            alt="2024 to 2025"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2024-2.png"
                            alt="2024 to 2025"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2024-3.png"
                            alt="2024 to 2025"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2024-4.png"
                            alt="2024 to 2025"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },

        {
            title: '2021 → 2024',
            content: (
                <div>
                    <p className="mb-8 text-xs text-neutral-800 md:text-base dark:text-neutral-200">
                        Expanded the platform with additional features and integrations while adapting to real user needs. The focus shifted toward
                        system stability, content growth, and iterative improvements based on usage feedback.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/rule_library/our_journey/2021-1.png"
                            alt="2021 to 2024"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2021-2.png"
                            alt="2021 to 2024"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },

        {
            title: '2019 → 2021',
            content: (
                <div>
                    <p className="mb-8 text-xs text-neutral-800 md:text-base dark:text-neutral-200">
                        The foundation stage where the initial concept was shaped and the first version of the website was built. Core functionality
                        was established, setting the direction for future development and expansion.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/assets/rule_library/our_journey/2019-1.png"
                            alt="2019 to 2021"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                        <img
                            src="/assets/rule_library/our_journey/2019-2.png"
                            alt="2019 to 2021"
                            width={500}
                            height={500}
                            className="h-20 w-full rounded-lg bg-white object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06)] md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
    ];
    return (
        <FrontPageLayout>
            <div className="section-container relative overflow-clip">
                <Timeline data={data} />
            </div>
        </FrontPageLayout>
    );
}
