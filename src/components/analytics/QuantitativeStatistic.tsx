import { Paper, Popper, Tooltip } from "@mui/material";
import { Getter, GraphableDataset } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";
import { useEffect, useMemo, useRef, useState } from "react";
import { describeQuantitativeObjects } from "../../util/analytics/objectStatistics";
import StatisticLineChart from "./StatisticLineChart";

export interface QuantitativeStatisticProps<T extends object> extends StatisticProps {
    digits?: number,
    unit?: string,
    dataset: GraphableDataset<T, any>,
    getter: Getter<T>,
    graphable?: boolean,
    graphGetter?: Getter<T>,
}

export default function QuantitativeStatistic<T extends object>({ dataset, getter, digits: d = 2, unit = "", graphable, graphGetter, ...props }: QuantitativeStatisticProps<T>) {
    
    const graphButtonRef = useRef<HTMLButtonElement>(null);
    const [graphOpen, setGraphOpen] = useState(false);
    
    const stats = useMemo(() => describeQuantitativeObjects(getter, dataset), [dataset, getter]);

    function handleOpen(e: React.MouseEvent) {
        setGraphOpen(v=>!v);
    }

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (graphButtonRef.current && !graphButtonRef.current.contains(e.target as Node)) setGraphOpen(false);
        }
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [])

    return (
        <Statistic {...props}>
            <Tooltip title={`Average: ${maxDecimal(stats.avg, d) + unit} SD: ${maxDecimal(stats.sd, d)} Total: ${maxDecimal(stats.sum, d)} Samples: ${maxDecimal(stats.n, d)}`} placement="top" arrow>
                <b>{maxDecimal(stats.avg, d) + unit}</b>
            </Tooltip>
            <span className="text-gray-500 text-sm">(min: {maxDecimal(stats.min, d) + unit} max: {maxDecimal(stats.max, d) + unit})</span>
            {graphable && <>
                <button ref={graphButtonRef} onClick={handleOpen} className="material-symbols-outlined text-secondary">query_stats</button>
                <Popper open={graphOpen} anchorEl={graphButtonRef.current} placement="right">
                    <Paper elevation={3} className="p-2">
                        <StatisticLineChart dataset={dataset} getter={graphGetter || getter} />
                    </Paper>
                </Popper>
            </>}
        </Statistic>
    )
}