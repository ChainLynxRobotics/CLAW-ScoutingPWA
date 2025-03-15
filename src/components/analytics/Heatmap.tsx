import { useEffect, useMemo, useRef, useState } from "react";
import Heatmap from 'visual-heatmap';
import { HeatmapRenderer } from "visual-heatmap/dist/types/heatmap";
import { HeatmapConfig, Point } from "visual-heatmap/dist/types/types";

interface HeatMapProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Point[];
    config: HeatmapConfig;
}

export default function HeatMap({ data, config, ...props }: HeatMapProps) {
    
    return <InternalHeatMap key={JSON.stringify(data)} data={data} config={config} {...props} />
}

// This is the internal version of the HeatMap component that doesn't reset the heatmap when the data changes.
function InternalHeatMap({ data, config, ...props }: HeatMapProps) {

    const ref = useRef<HTMLDivElement>(null);
    const heatmapInstance = useRef<HeatmapRenderer>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (heatmapInstance.current) return;
        heatmapInstance.current = Heatmap(ref.current, config);
        heatmapInstance.current.addData(data, true);
    }, [ref, config, data]);

    return (
        <div ref={ref} style={{ top: 0, left: 0, width: "100%", height: "100%", position: "absolute" }} {...props}></div>
    )
}