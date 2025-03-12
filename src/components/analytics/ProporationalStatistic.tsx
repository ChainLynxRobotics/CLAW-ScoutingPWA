import { Getter, GraphableDataset, ProportionalStats, } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";

export interface ProportionalStatisticProps<T extends object = any> extends StatisticProps {
    digits?: number,
    stats: ProportionalStats,
    graph?: {
        dataset: GraphableDataset<T>,
        getter: Getter<T>,
    }
}

export default function ProportionalStatistic({ stats, digits: d = 2, ...props }: ProportionalStatisticProps) {
    return (
        <Statistic {...props}>
            <b>{maxDecimal(stats.p * 100, d)}%</b>
            <span className="text-gray-500">({maxDecimal(stats.x, d)}/{maxDecimal(stats.n, d)})</span>
        </Statistic>
    )
}