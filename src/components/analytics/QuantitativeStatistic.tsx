import { Tooltip } from "@mui/material";
import { Getter, GraphableDataset } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";
import { useMemo } from "react";
import { describeQuantitativeObjects } from "../../util/analytics/objectStatistics";
import StatisticLineChartPopper from "./StatisticLineChartPopper";

export interface QuantitativeStatisticProps<T extends object> extends StatisticProps {
    digits?: number,
    unit?: string,
    dataset: GraphableDataset<T, any>,
    getter: Getter<T>,
    graphable?: boolean,
    graphGetter?: Getter<T>,
}

export default function QuantitativeStatistic<T extends object>({ dataset, getter, digits: d = 2, unit = "", graphable, graphGetter, ...props }: QuantitativeStatisticProps<T>) {
    
    const stats = useMemo(() => describeQuantitativeObjects(getter, dataset), [dataset, getter]);

    return (
        <Statistic {...props}>
            <Tooltip title={`Average: ${maxDecimal(stats.avg, d) + unit} SD: ${maxDecimal(stats.sd, d)} Total: ${maxDecimal(stats.sum, d)} Samples: ${maxDecimal(stats.n, d)}`} placement="top" arrow>
                <b>{maxDecimal(stats.avg, d) + unit}</b>
            </Tooltip>
            <span className="text-gray-500 text-sm">(min: {maxDecimal(stats.min, d) + unit} max: {maxDecimal(stats.max, d) + unit})</span>
            {graphable && <>
                <StatisticLineChartPopper dataset={dataset} getter={graphGetter || getter} />
            </>}
        </Statistic>
    )
}