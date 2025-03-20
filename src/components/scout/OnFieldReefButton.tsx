import { Button, ButtonProps } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import CoralScoreLocation from "../../enums/CoralScoreLocation";
import { SettingsContext } from "../context/SettingsContextProvider";
import { ScoutingContext } from "../context/ScoutingContextProvider";
import AllianceColor from "../../enums/AllianceColor";

const MENU_WIDTH = 350;
const MENU_OPACITY = 0.5;
const MENU_HOVER_OPACITY = 0.75;
const MENU_CENTER_RADIUS = 50;
const MENU_CENTER_PADDING = 5;
const MENU_CENTER_TOTAL = MENU_CENTER_RADIUS + MENU_CENTER_PADDING;
const MENU_ITEMS = [
    CoralScoreLocation.A,
    CoralScoreLocation.B,
    CoralScoreLocation.C,
    CoralScoreLocation.D,
    CoralScoreLocation.E,
    CoralScoreLocation.F,
    CoralScoreLocation.G,
    CoralScoreLocation.H,
    CoralScoreLocation.I,
    CoralScoreLocation.J,
    CoralScoreLocation.K,
    CoralScoreLocation.L,
];
const MENU_ITEM_PADDING_RADIANS = 2 /* deg */ * Math.PI / 180;
const MENU_ITEM_WIDTH_RADIANS = 2 * Math.PI / MENU_ITEMS.length - MENU_ITEM_PADDING_RADIANS;
const CORAL_RADIUS = 10;
const CORAL_POS = 25;
const CLIP_POLYGON_SIDES = 6;

function xRad(rad: number, r: number) {
    return Math.cos(rad) * r + MENU_WIDTH / 2;
}

function yRad(rad: number, r: number) {
    return Math.sin(rad) * r + MENU_WIDTH / 2;
}

function coordAtRad(rad: number, r: number) {
    return xRad(rad, r) + " " + yRad(rad, r);
}

type OnFieldReefButtonProps = ButtonProps & {
    label: string;
    locations: CoralScoreLocation[];
    setLocations: (v: CoralScoreLocation[]) => void;
}

/**
 * Button with an action wheel for selecting coral locations
 * 
 * For reefscape 2025
 */
export function OnFieldReefButton({ label, locations, setLocations, ...props}: OnFieldReefButtonProps) {

    const settings = useContext(SettingsContext);
    const context = useContext(ScoutingContext);

    const [open, setOpen] = useState(false);
    const openedAt = useRef<number>(0);
    const closedAt = useRef<number>(0);
    const [selected, setSelected] = useState<CoralScoreLocation | "close" | null>(null);

    function vibrateForIncrease() {
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    }

    function vibrateForDecrease() {
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 100, 100]);
        }
    }

    function onClick(loc: CoralScoreLocation) {
        if (locations.includes(loc)) {
            setLocations(locations.filter(v => v != loc));
            vibrateForDecrease();
        } else {
            setLocations([...locations, loc]);
            vibrateForIncrease();
        }
    }

    useEffect(() => {
        const setClosed = () => {
            if (openedAt.current + 250 < Date.now()) {
                setOpen(false);
                closedAt.current = Date.now();
            }
        }
        window.addEventListener('pointerup', setClosed);
        return () => window.removeEventListener('pointerup', setClosed);
    }, []);

    useEffect(() => {
        const closeOnEscape = (e: KeyboardEvent) => {
            if (e.key == "Escape") {
                setOpen(false);
                closedAt.current = Date.now();
            }
        }
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, []);

    return (
        <div className="relative touch-none">
            <Button
                variant="contained"
                color="primary"
                size="small"
                onPointerDown={() => {
                    if (closedAt.current + 250 > Date.now()) return;
                    setOpen(true);
                    openedAt.current = Date.now();
                }}
                onClick={(e) => {
                    if (closedAt.current + 250 > Date.now()) return;
                    setOpen(true);
                    e.preventDefault();
                }}
                onTouchStart={(e) => {
                    e.currentTarget.releasePointerCapture(e.touches[0].identifier);
                }}
                {...props}
            >
                {label} ({locations.length})
            </Button>
            {open && 
                <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: MENU_WIDTH, height: MENU_WIDTH }}>
                    
                    {/* Do not even try to understand this SVG. It's a mess. */}

                    <svg height={MENU_WIDTH} width={MENU_WIDTH} xmlns="http://www.w3.org/2000/svg">
                        <clipPath id="menu-clip">
                            <polygon points={
                                Array.from({length: CLIP_POLYGON_SIDES}, (_, i) => {
                                    const rad = (i+0.5) * 2 * Math.PI / CLIP_POLYGON_SIDES;
                                    return xRad(rad, MENU_WIDTH/2)+","+yRad(rad, MENU_WIDTH/2);
                                }).join(" ")
                            }
                            />
                        </clipPath>
                        <g
                            cursor={"pointer"}
                            tabIndex={0}
                            onPointerUp={() => {
                                if (openedAt.current + 250 < Date.now()) {
                                    setOpen(false);
                                    closedAt.current = Date.now();
                                }
                            }}
                            onPointerOver={() => setSelected("close")}
                            onPointerOut={() => setSelected(null)}
                        >
                            <circle 
                                cx={MENU_WIDTH/2} cy={MENU_WIDTH/2} r={MENU_CENTER_RADIUS} 
                                fill="black" fillOpacity={selected == "close" ? MENU_HOVER_OPACITY : MENU_OPACITY} 
                            />
                            <text 
                                x={MENU_WIDTH/2} y={MENU_WIDTH/2} 
                                dominantBaseline="middle" textAnchor="middle"
                                fill="white" fontSize="32"
                            >
                                &#10006;
                            </text>
                        </g>
                        <g clipPath="url(#menu-clip)">
                            {MENU_ITEMS.map((item, i) => {
                                const startRad = (settings?.fieldRotated == (context?.allianceColor === AllianceColor.Blue) ? 0 : Math.PI) + 
                                    MENU_ITEM_PADDING_RADIANS/2 + MENU_ITEM_WIDTH_RADIANS 
                                    - (i * (MENU_ITEM_WIDTH_RADIANS + MENU_ITEM_PADDING_RADIANS));
                                const nextRad = startRad - MENU_ITEM_WIDTH_RADIANS;
                                const middleRad = (startRad - MENU_ITEM_WIDTH_RADIANS/2);
                                return (
                                <g
                                    key={item}
                                    cursor={"pointer"}
                                    tabIndex={0}
                                    onPointerUp={() => onClick(item)}
                                    onPointerOver={() => setSelected(item)}
                                    onPointerOut={() => setSelected(null)}
                                >
                                    <path
                                        d={
                                            `M ${coordAtRad(startRad, MENU_WIDTH/2)}` +
                                            `L ${coordAtRad(startRad, MENU_CENTER_TOTAL)}` +
                                            `A ${MENU_CENTER_TOTAL} ${MENU_CENTER_TOTAL} 0 0 0 ${coordAtRad(nextRad, MENU_CENTER_TOTAL)}` +
                                            `L ${coordAtRad(nextRad, MENU_WIDTH/2)}` +
                                            `A ${MENU_WIDTH/2} ${MENU_WIDTH/2} 0 0 1 ${coordAtRad(startRad, MENU_WIDTH/2)}` +
                                            `Z`
                                        } 
                                        fill="black" fillOpacity={selected == item ? MENU_HOVER_OPACITY : MENU_OPACITY}
                                    />
                                    <text 
                                        x={xRad(middleRad, MENU_CENTER_TOTAL + 10)} 
                                        y={yRad(middleRad, MENU_CENTER_TOTAL + 10)} 
                                        dominantBaseline="middle" textAnchor="middle"
                                        fill="white" fontSize="12"
                                    >
                                        {CoralScoreLocation[item]}
                                    </text>
                                    {locations.includes(item) && (
                                        <g 
                                            transform={`translate(${coordAtRad(middleRad, MENU_CENTER_TOTAL + CORAL_POS)}) rotate(${middleRad * 180 / Math.PI}, 0, 0)`} 
                                            fill="#ffffff" fillOpacity={1} stroke="#000000" strokeWidth="1" strokeLinejoin="round"
                                        >
                                            <ellipse cx={CORAL_RADIUS*4} cy={0} rx={CORAL_RADIUS/2} ry={CORAL_RADIUS} />
                                            <path d={
                                                `M 0 -${CORAL_RADIUS} ` + 
                                                `L ${CORAL_RADIUS*4} -${CORAL_RADIUS} ` + 
                                                `A ${CORAL_RADIUS/2} ${CORAL_RADIUS} 0 0 0 ${CORAL_RADIUS*4} ${CORAL_RADIUS}` +
                                                `L 0 ${CORAL_RADIUS}` +
                                                `A ${CORAL_RADIUS/2} ${CORAL_RADIUS} 0 0 1 0 -${CORAL_RADIUS} ` +
                                                `Z`
                                            } />
                                        </g>
                                    )}
                                </g>)
                            })}
                        </g>
                    </svg>
                </div>
            }
        </div>
    )
}