import { Getter, GraphableDataset } from "../../types/analyticsTypes";
import { StatisticProps } from "./Statistic";
import QuantitativeStatistic from "./QuantitativeStatistic";
import ProportionalStatistic from "./ProporationalStatistic";
import { get, normalizeToNumber } from "../../util/analytics/objectStatistics";

export type QuantitativeProportionalStatisticProps<T extends object> = StatisticProps & {
    digits?: number,
    dataset: GraphableDataset<T, any>,
    successes: Getter<T>,
    failures: Getter<T>,
    graphable?: boolean,
}

export default function QuantitativeProportionalStatistic<T extends object>({ dataset, successes, failures, digits: d = 2, ...props }: QuantitativeProportionalStatisticProps<T>) {
    return (
        <>
            <QuantitativeStatistic 
                digits={d} 
                dataset={dataset}
                getter={successes}
                {...props}
                />
            <ProportionalStatistic 
                name="└ Accuracy" 
                digits={d} 
                pl="24px" 
                className="text-gray-500"
                dataset={dataset}
                graphable={props.graphable}
                getter={(data) => ({ successes: normalizeToNumber(get(data, successes))||0, failures: normalizeToNumber(get(data, failures))||0 })}
                graphGetter={(data) => normalizeToNumber(get(data, successes))||0 / ((normalizeToNumber(get(data, successes))||0) + (normalizeToNumber(get(data, failures))||0))}
            />
            <QuantitativeStatistic 
                name="└ Attempts" 
                digits={d} 
                pl="24px" 
                className="text-gray-500"
                dataset={dataset}
                graphable={props.graphable}
                getter={(data) => (normalizeToNumber(get(data, successes))||0) + (normalizeToNumber(get(data, failures))||0)}
            />
        </>
    )
}