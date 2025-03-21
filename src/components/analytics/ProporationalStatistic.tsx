import { Getter, GraphableDataset, } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";
import { useMemo } from "react";
import { describeProportionalObjects } from "../../util/analytics/objectStatistics";
import StatisticLineChartPopper from "./StatisticLineChartPopper";

export interface ProportionalStatisticProps<T extends object> extends StatisticProps {
    digits?: number,
    dataset: GraphableDataset<T, any>,
    getter: Getter<T>,
    graphable?: boolean,
    graphGetter?: Getter<T>,
}

export default function ProportionalStatistic<T extends object>({ dataset, getter, digits: d = 2, graphable, graphGetter, ...props }: ProportionalStatisticProps<T>) {

    const stats = useMemo(() => describeProportionalObjects(getter, dataset), [dataset, getter]);

    return (
        <Statistic {...props}>
            <b>{maxDecimal(stats.p * 100, d)}%</b>
            <span className="text-gray-500 text-sm">({maxDecimal(stats.x, d)}/{maxDecimal(stats.n, d)})</span>
            {graphable && <>
                <StatisticLineChartPopper dataset={dataset} getter={graphGetter || getter} />
            </>}
        </Statistic>
    )
}