import { Button, ButtonProps, Menu, MenuItem } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";

type OnFieldMenuButtonProps = {
    label: string;
    id: string;
    menuItems: {label: string, value: number, setValue: (v: number) => void}[];
} & Omit<ButtonProps, "children">;

/**
 * Button that increments a value when clicked or holding it to decrement it.
 * 
 * Can be used in conjunction with OnFieldButtonGroup
 */
export function OnFieldMenuButton({ label, id, menuItems, ...props}: OnFieldMenuButtonProps) {

    const {enqueueSnackbar} = useSnackbar();

    function handleMenuButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

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

    function onClick(item: OnFieldMenuButtonProps["menuItems"][0]) {
        item.setValue(item.value + 1);
        vibrateForIncrease();
    }

    function onHoldClick(item: OnFieldMenuButtonProps["menuItems"][0]) {
        if (item.value <= 0) return;
        item.setValue(item.value - 1);
        enqueueSnackbar(`Decreased ${item.label} to ${item.value - 1}`, { variant: 'error' });
        vibrateForDecrease();
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <Button
                id={id}
                variant="contained"
                color="primary"
                onClick={handleMenuButtonClick}
                {...props}
            >
                {label} ({menuItems.reduce((acc, item) => acc + item.value, 0)})
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': id,
                }}
            >
                {menuItems.map((item, i) => (
                    <MenuItem 
                        key={i} 
                        onPointerDown={() => {
                            const start = Date.now();
                            document.addEventListener('pointerup', () => {
                                if (Date.now() - start < 500) onClick(item);
                                else onHoldClick(item);
                            }, { once: true });
                        }}
                    >
                        {item.label} ({item.value})
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}