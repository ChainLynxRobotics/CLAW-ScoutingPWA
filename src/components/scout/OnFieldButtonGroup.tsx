import { HTMLAttributes, ReactNode } from "react";

export type OnFieldButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
    label: string;
    vertical?: boolean;
    align?: 'start' | 'center' | 'end';
    children?: ReactNode;
    /** Vertical relative proportion of surrounding element, from 0 - 1 */
    top: number;
    /** Horizontal relative proportion of surrounding element, from 0 - 1 */
    left: number;
    listProps?: HTMLAttributes<HTMLDivElement>;
}


export default function OnFieldButtonGroup({ label, vertical, align = 'center', children, top, left, listProps, ...props }: OnFieldButtonGroupProps) {
    return (
        <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2" 
            style={{ top: `${top * 100}%`, left: `${left * 100}%`, alignItems: align }}
            {...props}
        >
            <div className="bg-black bg-opacity-50 rounded-lg px-2 py-1">
                <label className="text-white">{label}</label>
            </div>
            <div 
                className={`grid gap-2 ` + (vertical ? 'grid-rows-2' : 'grid-cols-2')}
                {...listProps}
            >
                {children}
            </div>
        </div>
    )

}