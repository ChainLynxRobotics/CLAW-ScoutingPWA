import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { HTMLAttributes, useState } from "react";

export type StatisticProps = HTMLAttributes<HTMLDivElement> & {
    /** The name, displays before any child data */
    name: string, 
    /** A longer description for extra info, when this is defined, an info (i) icon will appear that shows the set data in a popup when clicked. */
    desc?: string,
    /** Padding left for the element, used for indicating one statistic is a child of another in the UI */
    pl?: string,
    /** Ref for the element */
    ref?: React.Ref<HTMLDivElement>
}

/**
 * A basic statistic element wrapper that displays a name with some other options.
 * See `StatisticProps` for more information.
 * 
 * @param props - The props for this statistic. Only the name is required.
 * @returns The statistic element.
 */
export default function Statistic(props: StatisticProps & {children?: React.ReactNode}) {

    const [infoOpen, setInfoOpen] = useState(false);
    
    return (
        <div {...props} className={"flex items-center gap-2 whitespace-nowrap "+props.className} style={{paddingLeft: props.pl, ...props.style}}>
            <span className="-indent-2 pl-2">{props.name}: </span>
            {props.children}
            
            {props.desc && 
                <>
                    <button onClick={()=>setInfoOpen(true)} className="material-symbols-outlined text-secondary text-right">info</button>
                    <Dialog 
                        open={infoOpen} 
                        onClose={()=>setInfoOpen(false)}
                        aria-labelledby="info-dialog-title"
                        maxWidth="sm"
                    >
                        <DialogTitle id="info-dialog-title">Info</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {props.desc}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={()=>setInfoOpen(false)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </>
            }
        </div>
    )
}