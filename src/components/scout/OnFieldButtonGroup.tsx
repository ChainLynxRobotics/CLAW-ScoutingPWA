import { HTMLAttributes, ReactNode } from "react";

export type OnFieldButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
    label: string;
    vertical?: boolean;
    children?: ReactNode;
    /** Vertical relative proportion of surrounding element, from 0 - 1 */
    top: number;
    /** Horizontal relative proportion of surrounding element, from 0 - 1 */
    left: number;
}


export default function OnFieldButtonGroup({ label, vertical, children, top, left, ...props }: OnFieldButtonGroupProps) {
    return (
        <div 
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2`} 
            style={{ top: `${top * 100}%`, left: `${left * 100}%` }}
            {...props}
        >
            <div className="bg-black bg-opacity-50 rounded-lg px-2 py-1">
                <label className="text-white">{label}</label>
            </div>
            <div className={`flex gap-2 ${vertical ? 'flex-col' : 'flex-row'}`}>
                {children}
            </div>
        </div>
    )

}