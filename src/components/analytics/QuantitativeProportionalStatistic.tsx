import { Getter, GraphableDataset, QuantitativeProportionalStats } from "../../types/analyticsTypes";
import { StatisticProps } from "./Statistic";
import QuantitativeStatistic from "./QuantitativeStatistic";
import ProportionalStatistic from "./ProporationalStatistic";
import { get } from "../../util/analytics/objectStatistics";

export type QuantitativeProportionalStatisticProps<T extends object> = StatisticProps & {
    stats: QuantitativeProportionalStats,
    digits?: number,
    graph?: {
        dataset: GraphableDataset<T>,
        successes: Getter<T>,
        failures: Getter<T>,
    }
}

export default function QuantitativeProportionalStatistic<T extends object>({ stats, digits: d = 2, graph, ...props }: QuantitativeProportionalStatisticProps<T>) {
    return (
        <>
            <QuantitativeStatistic 
                digits={d} 
                stats={stats.x} 
                graph={graph && { dataset: graph.dataset, getter: graph.successes}} 
                {...props}
                />
            <ProportionalStatistic 
                name="└ Accuracy" 
                digits={d} 
                pl="24px" 
                disabled 
                stats={stats.p}
                graph={graph && { dataset: graph.dataset, getter: (data) => get(data, graph.successes) / (get(data, graph.successes) + get(data, graph.failures))}}
            />
            <QuantitativeStatistic 
                name="└ Attempts" 
                digits={d} 
                pl="24px" 
                disabled 
                stats={stats.n} 
                graph={graph && { dataset: graph.dataset, getter: (data) => get(data, graph.successes) + get(data, graph.failures)}}
            />
        </>
    )
}