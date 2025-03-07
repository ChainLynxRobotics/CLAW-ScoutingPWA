import { useContext, useMemo } from "react";
import { ScheduleContext } from "../context/ScheduleContextProvider";
import { Slider, Tooltip } from "@mui/material";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";

export default function TeamAnalyticsMatchSelection({ min, max, onChange }: { min: number, max: number, onChange: (min: number, max: number) => void }) {
    
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') return;
        console.log(newValue);
        onChange(newValue[0], newValue[1]);
    };

    const valueText = (value: number) => {
        return schedule.matches[value].matchId;
    }

    const marks = useMemo(() => {
        return schedule.matches.filter((_, index) => (index + 1) % 5 === 0 || index === 0).map((match, index) => {
            return {
                value: schedule.matches.indexOf(match),
                label: match.matchId
            }
        });
    }, [schedule.matches]);

    return (
        <>
            {analyticsSettings.currentCompetitionOnly && schedule.matches.length > 0 &&
                <div className="w-full px-8 pt-8 pb-4">
                    <Slider
                        disabled={schedule.matches.length === 0 || !analyticsSettings.currentCompetitionOnly}
                        aria-label="Match Range"
                        value={[min, max]}
                        valueLabelDisplay="on"
                        onChange={handleChange}
                        min={0}
                        max={schedule.matches.length - 1}
                        step={1}
                        getAriaValueText={valueText}
                        valueLabelFormat={valueText}
                        marks={marks}
                    />
                </div>
            }
            {!analyticsSettings.currentCompetitionOnly &&
                <div className="w-full px-8 py-4 flex flex-col items-center justify-center">
                    <span className="text-secondary">
                        Enable "Current Competition Only" to select a range of matches
                    </span>
                </div>
            }
        </>
    )
}