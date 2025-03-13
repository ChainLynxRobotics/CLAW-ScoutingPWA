import { useContext } from "react";
import { GraphableDataset, Getter } from "../../types/analyticsTypes";
import { get } from "../../util/analytics/objectStatistics";
import { ScheduleContext } from "../context/ScheduleContextProvider";
import { LineChart } from "@mui/x-charts";

export interface QuantitativeStatisticProps<T extends object> {
    dataset: GraphableDataset<T, string>,
    getter: Getter<T>,
}

export default function StatisticLineChart<T extends object>({ dataset, getter }: QuantitativeStatisticProps<T>) {
    
    const scheduleContext = useContext(ScheduleContext);



    return (
        <LineChart
            xAxis={[
                {
                                    
                }
            ]}
            series={[
                {
                    
                }
            ]}
        />
    );
}