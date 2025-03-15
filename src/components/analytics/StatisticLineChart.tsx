import { use, useContext, useMemo } from "react";
import { GraphableDataset, Getter } from "../../types/analyticsTypes";
import { get, normalizeToNumber } from "../../util/analytics/objectStatistics";
import { ScheduleContext } from "../context/ScheduleContextProvider";
import { LineChart, LineChartProps, LineSeriesType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";

export interface QuantitativeStatisticProps<T extends object> extends Omit<LineChartProps, 'xAxis' | 'series' | 'dataset'> {
    dataset: GraphableDataset<T>,
    getter: Getter<T>,
};

export default function StatisticLineChart<T extends object>({ dataset, getter, ...props }: QuantitativeStatisticProps<T>) {
    
    const matches = useContext(ScheduleContext)?.matches;
    if (matches === undefined) throw new Error("ScheduleContext is not provided");

    const series = useMemo(() => [
        ...dataset.positive.map<MakeOptional<LineSeriesType, "type">>((data, i) => ({
            data: dataset.xData // For all x values, get the data point for it, or null if it doesn't exist
                .map(x => data.find(d => dataset.xEquals?.(dataset.xGetter(d), x) || dataset.xGetter(d) === x))
                .map(d => d && get(d, getter)) // Map to the data value
                .map(normalizeToNumber) // Normalize to number
                .map(d => d ?? null), // Map to null if undefined
            label: dataset.positiveGroupNames[i],
            id: 'positive-' + dataset.positiveGroupNames?.[i],
            connectNulls: true,
            showMark: false
        })),
        ...(dataset.negative?.map<MakeOptional<LineSeriesType, "type">>((data, i) => ({
            data: dataset.xData // For all x values, get the data point for it, or null if it doesn't exist
                .map(x => data.find(d => dataset.xEquals?.(dataset.xGetter(d), x) || dataset.xGetter(d) === x))
                .map(d => d && get(d, getter)) // Map to the data value
                .map(normalizeToNumber) // Normalize to number
                .map(d => d && -1 * d) // Invert the value (only applies to the negative data)
                .map(d => d ?? null), // Map to null if undefined
            label: dataset.negativeGroupNames?.[i],
            id: 'negative-' + dataset.negativeGroupNames?.[i],
            connectNulls: true,
            showMark: false
        })) ?? []),
    ], [dataset, getter]);


    console.log(dataset.xData, series);

    return (
        <LineChart
            xAxis={[
                {
                    data: dataset.xData,
                    valueFormatter: dataset.xSerializer,
                    min: dataset.xData[0] || 0,
                    max: dataset.xData[dataset.xData.length - 1] || 0,
                }
            ]}
            series={series}
            width={300}
            height={250}
            margin={{ top: 60, bottom: 25, left: 25, right: 10 }}
            slotProps={{
                legend: {
                    hidden: false,
                    position: {
                        horizontal: 'middle',
                        vertical: 'top',
                    },
                    direction: 'row',
                    itemMarkWidth: 10,
                    itemMarkHeight: 10,
                    itemGap: 5,
                }
            }}
            {...props}
        />
    );
}