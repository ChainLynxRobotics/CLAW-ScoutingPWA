import { Getter, GraphableDataset, ProportionalStats, } from "../../types/analyticsTypes";
import Statistic, { StatisticProps } from "./Statistic";
import maxDecimal from "../../util/analytics/maxDecimal";
import { useEffect, useMemo, useRef, useState } from "react";
import { describeProportionalObjects } from "../../util/analytics/objectStatistics";
import { Paper, Popper } from "@mui/material";
import StatisticLineChart from "./StatisticLineChart";

export interface ProportionalStatisticProps<T extends object> extends StatisticProps {
    digits?: number,
    dataset: GraphableDataset<T, any>,
    getter: Getter<T>,
    graphable?: boolean,
    graphGetter?: Getter<T>,
}

export default function ProportionalStatistic<T extends object>({ dataset, getter, digits: d = 2, graphable, graphGetter, ...props }: ProportionalStatisticProps<T>) {

    const ref = useRef<HTMLDivElement>(null);
    const [graphOpen, setGraphOpen] = useState(false);

    const stats = useMemo(() => describeProportionalObjects(getter, dataset), [dataset, getter]);

    function handleOpen(e: React.MouseEvent) {
        e.stopPropagation();
        setGraphOpen(v=>!v);
    }

    useEffect(() => {
        const close = () => setGraphOpen(false);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [])

    return (
        <Statistic {...props} ref={ref}>
            <b>{maxDecimal(stats.p * 100, d)}%</b>
            <span className="text-gray-500 text-sm">({maxDecimal(stats.x, d)}/{maxDecimal(stats.n, d)})</span>
            {graphable && <>
                <button onClick={handleOpen} className="material-symbols-outlined text-secondary">query_stats</button>
                <Popper open={graphOpen} anchorEl={ref.current} placement="right">
                    <Paper elevation={3} className="p-2">
                        <StatisticLineChart dataset={dataset} getter={graphGetter || getter} />
                    </Paper>
                </Popper>
            </>}
        </Statistic>
    )
}