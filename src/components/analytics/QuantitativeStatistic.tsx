import { Tooltip } from "@mui/material";
import { QuantitativeStats } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";

export interface QuantitativeStatisticProps extends StatisticProps {
    digits?: number,
    asPercent?: boolean,
    asPercentMultiplier?: number,
    stats: QuantitativeStats,
}

export default function QuantitativeStatistic({ stats, digits: d = 2, asPercent, asPercentMultiplier = 100, ...props }: QuantitativeStatisticProps) {
    if (asPercent) {
        return (
            <Statistic {...props}>
                <Tooltip title={`Average: ${maxDecimal(stats.avg * asPercentMultiplier, d)}% SD: ${maxDecimal(stats.sd * asPercentMultiplier, d)} Total: ${maxDecimal(stats.sum, d)} Samples: ${maxDecimal(stats.n, d)}`} placement="top" arrow>
                    <b>{maxDecimal(stats.avg * asPercentMultiplier, d)}%</b>
                </Tooltip>
                <span className="text-gray-500">(min: {maxDecimal(stats.min * asPercentMultiplier, d)}% max: {maxDecimal(stats.max * asPercentMultiplier, d)}%)</span>
            </Statistic>
        )
    } else {
        return (
            <Statistic {...props}>
                <Tooltip title={`Average: ${maxDecimal(stats.avg, d)} SD: ${maxDecimal(stats.sd, d)} Total: ${maxDecimal(stats.sum, d)} Samples: ${maxDecimal(stats.n, d)}`} placement="top" arrow>
                    <b>{maxDecimal(stats.avg, d)}</b>
                </Tooltip>
                <span className="text-gray-500">(min: {maxDecimal(stats.min, d)} max: {maxDecimal(stats.max, d)})</span>
            </Statistic>
        )
    }
}