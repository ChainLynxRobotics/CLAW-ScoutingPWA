import { useEffect, useRef } from "react";
import Heatmap from 'visual-heatmap';
import { HeatmapRenderer } from "visual-heatmap/dist/types/heatmap";
import { HeatmapConfig, Point } from "visual-heatmap/dist/types/types";

interface HeatMapProps {
    data: Point[];
    config: HeatmapConfig;
}

export default function HeatMap({ data, config }: HeatMapProps) {

    const ref = useRef<HTMLDivElement>(null);
    const heatmapInstance = useRef<HeatmapRenderer>(null);

    const key = useRef(0);

    useEffect(() => {
        if (!ref.current) return;
        heatmapInstance.current = Heatmap(ref.current, config);
        heatmapInstance.current.addData(data, true);
        return () => {
            key.current++
        };
    }, [ref, config, data]);

    return (
        <div key={key.current} ref={ref} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }}></div>
    )
}