import { Button, Card, CardContent, CardHeader, CardProps, IconButton } from "@mui/material";
import { useState } from "react";

type AnalyticsCardProps = CardProps & {
    title: string;
    children: React.ReactNode;
}

/**
 * Collapsable Analytics Card
 */
export default function AnalyticsCard({ title, children, ...props}: AnalyticsCardProps) {

    const [visible, setVisible] = useState(true);

    function onClick() {
        setVisible(!visible);
    }

    return (
        <Card {...props}>
            <CardHeader title={title}
                action={
                    <IconButton onClick={onClick}>
                        <span className="material-symbols-outlined">
                            {visible ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                        </span>
                    </IconButton>
                }
            />
            {visible ?
                <CardContent className="max-h-[420px] !overflow-y-auto">
                    {children}
                </CardContent>
            : null}
        </Card>
    );
}