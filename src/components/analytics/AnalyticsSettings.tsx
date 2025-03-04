import { useContext, useState } from "react";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormHelperText, Switch } from "@mui/material";
import { SettingsContext } from "../context/SettingsContextProvider";

export default function AnalyticsSettings() {

    const settings = useContext(SettingsContext);
    const analyticsSettings = useContext(AnalyticsSettingsContext);

    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)} color="info">
                <span className="material-symbols-outlined">settings</span>
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Analytics Settings</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={analyticsSettings?.currentCompetitionOnly}
                                onChange={(e) => analyticsSettings?.setCurrentCompetitionOnly(e.target.checked)}
                                name="analyticsCurrentCompetitionOnly"
                                color="primary"
                            />
                        }
                        label="Current competition only"
                    />
                    <FormHelperText>Only show data from the current set competition (<code>{settings?.competitionId}</code>)</FormHelperText>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={analyticsSettings?.includeScoutingData}
                                onChange={(e) => analyticsSettings?.setIncludeScoutingData(e.target.checked)}
                                name="analyticsIncludeScoutingData"
                                color="primary"
                            />
                        }
                        label="Include Scouting Data"
                    />
                    <FormHelperText>Include scouting data from this scouting app in the analytics</FormHelperText>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={analyticsSettings?.includeBlueAllianceData}
                                onChange={(e) => analyticsSettings?.setIncludeBlueAllianceData(e.target.checked)}
                                name="analyticsIncludeBlueAllianceData"
                                color="primary"
                            />
                        }
                        label="Include TBA data"
                    />
                    <FormHelperText>Include data from The Blue Alliance API in the analytics</FormHelperText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}