import { Button, ButtonProps } from "@mui/material";
import { useSnackbar } from "notistack";

type OnFieldButtonProps = ButtonProps & {
    label: string;
    value: number;
    setValue: (v: number) => void;
}

/**
 * Button that increments a value when clicked or holding it to decrement it.
 * 
 * Can be used in conjunction with OnFieldButtonGroup
 */
export function OnFieldButton({ label, value, setValue, ...props}: OnFieldButtonProps) {

    const {enqueueSnackbar} = useSnackbar();

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

    function onClick() {
        setValue(value + 1);
        vibrateForIncrease();
    }

    function onHoldClick() {
        if (value <= 0) return;
        setValue(value - 1);
        enqueueSnackbar(`Decreased ${label} to ${value - 1}`, { variant: 'error', preventDuplicate: true, autoHideDuration: 1000 });
        vibrateForDecrease();
    }

    return (
        <Button
            variant="contained"
            color="primary"
            size="small"
            onPointerDown={() => {
                const start = Date.now();
                document.addEventListener('pointerup', () => {
                    if (Date.now() - start < 500) onClick();
                    else onHoldClick();
                }, { once: true });
            }}
            {...props}
        >
            {label} ({value})
        </Button>
    )
}