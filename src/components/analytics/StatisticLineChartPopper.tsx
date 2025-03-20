import { useEffect, useRef, useState } from "react";
import { GraphableDataset, Getter } from "../../types/analyticsTypes";
import { Popper, Paper, useMediaQuery, Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import StatisticLineChart from "./StatisticLineChart";

interface StatisticLineChartPopperProps<T extends object> {
    dataset: GraphableDataset<T, any>,
    getter: Getter<T>,
}

export default function StatisticLineChartPopper<T extends object>({ dataset, getter }: StatisticLineChartPopperProps<T>) {
    
    const graphButtonRef = useRef<HTMLButtonElement>(null);
    const [graphOpen, setGraphOpen] = useState(false);

    const mobile = useMediaQuery("(min-width: 640px)")!;

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
        <>
            <button ref={graphButtonRef} onClick={handleOpen} className="material-symbols-outlined text-secondary">query_stats</button>
            {mobile ?
                <Popper open={graphOpen} anchorEl={graphButtonRef.current} placement="right">
                    <Paper elevation={3} className="p-2">
                        <StatisticLineChart dataset={dataset} getter={getter} />
                    </Paper>
                </Popper>
            :
                <Dialog open={graphOpen} onClose={()=>setGraphOpen(false)}>
                    <DialogTitle sx={{ m: 0, p: 2 }}>
                        Graph
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={()=>setGraphOpen(false)}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </IconButton>
                    <DialogContent>
                        <StatisticLineChart dataset={dataset} getter={getter} />
                    </DialogContent>
                </Dialog>
            }
        </>
    )
}