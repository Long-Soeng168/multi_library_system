import ChartAreaDoubleLayer from '@/components/Chart/chart-area-double-layer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';

const DashboardChart = () => {
    const { chartDataViews, chartDataReads, chartDataDownloads } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <>
            <div className="p-4">
                <Tabs defaultValue="views" className="w-full">
                    <TabsList>
                        <TabsTrigger value="views">{t('Views')}</TabsTrigger>
                        <TabsTrigger value="reads">{t('Reads')}</TabsTrigger>
                        <TabsTrigger value="downloads">{t('Downloads')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="views">
                        <ChartAreaDoubleLayer
                            chartData={chartDataViews}
                            title={t('Library Resources View Chart')}
                            short_description={t('Showing total views for the last 3 months')}
                        />
                    </TabsContent>
                    <TabsContent value="reads">
                        <ChartAreaDoubleLayer
                            chartData={chartDataReads}
                            title={t('Library Resources read Chart')}
                            short_description={t('Showing total reads for the last 3 months')}
                        />
                    </TabsContent>
                    <TabsContent value="downloads">
                        <ChartAreaDoubleLayer
                            chartData={chartDataDownloads}
                            title={t('Library Resources download Chart')}
                            short_description={t('Showing total downloads for the last 3 months')}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default DashboardChart;
