import { QuantitativeProportionalStats } from "../../types/analyticsTypes";
import { StatisticProps } from "./Statistic";
import QuantitativeStatistic from "./QuantitativeStatistic";
import ProportionalStatistic from "./ProporationalStatistic";

export interface QuantitativeProportionalStatisticProps extends StatisticProps {
    digits?: number,
    stats: QuantitativeProportionalStats,
}

export default function QuantitativeProportionalStatistic({ stats, digits: d = 2, ...props }: QuantitativeProportionalStatisticProps) {
    return (
        <>
            <QuantitativeStatistic digits={d} stats={stats.x} {...props} />
            <ProportionalStatistic name="└ Accuracy" digits={d} pl="24px" disabled stats={stats.p} />
            <QuantitativeStatistic name="└ Attempts" digits={d} pl="24px" disabled stats={stats.n} />
        </>
    )
}