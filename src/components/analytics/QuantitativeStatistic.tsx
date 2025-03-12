import { Tooltip } from "@mui/material";
import { Getter, GraphableDataset, QuantitativeStats } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";

export interface QuantitativeStatisticProps<T extends object = any> extends StatisticProps {
    digits?: number,
    stats: QuantitativeStats,
    unit?: string,
    graph?: {
        dataset: GraphableDataset<T>,
        getter: Getter<T>,
    }
}

export default function QuantitativeStatistic({ stats, digits: d = 2, unit = "", ...props }: QuantitativeStatisticProps) {
    return (
        <Statistic {...props}>
            <Tooltip title={`Average: ${maxDecimal(stats.avg, d) + unit} SD: ${maxDecimal(stats.sd, d)} Total: ${maxDecimal(stats.sum, d)} Samples: ${maxDecimal(stats.n, d)}`} placement="top" arrow>
                <b>{maxDecimal(stats.avg, d) + unit}</b>
            </Tooltip>
            <span className="text-gray-500">(min: {maxDecimal(stats.min, d) + unit} max: {maxDecimal(stats.max, d) + unit})</span>
        </Statistic>
    )
}