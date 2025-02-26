import { QuantitativeProportionalStats } from "../../types/analyticsTypes";
import { StatisticProps } from "./Statistic";
import ProportionalStatistic from "./ProporationalStatistic";
import QuantitativeStatistic from "./QuantitativeStatistic";

export interface QuantitativeProportionalStatisticProps extends StatisticProps {
    digits?: number,
    stats: QuantitativeProportionalStats,
}

export default function QuantitativeProportionalStatistic({ stats, digits: d = 2, ...props }: QuantitativeProportionalStatisticProps) {
    return (
        <>
            <ProportionalStatistic digits={d} stats={{sample: [], p: stats.p.avg, x: stats.x.sum, n: stats.n.sum}} {...props} />
            <QuantitativeStatistic name="└ Accuracy" digits={d} pl="24px" stats={stats.p} asPercent />
            <QuantitativeStatistic name="└ Successful" digits={d} pl="24px" stats={stats.x} />
            <QuantitativeStatistic name="└ Attempts" digits={d} pl="24px" stats={stats.n} />
        </>
    )
}