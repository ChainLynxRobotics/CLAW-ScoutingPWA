import { AppBar, Box, Button, Container, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import BluetoothStatus from "./BluetoothStatus";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const pages = [
    {name: "Scout", path: "/scout", icon: "description"},
    {name: "Saved Matches", path: "/data", icon: "storage"},
    {name: "Schedule", path: "/schedule", icon: "event_note"},
    {name: "Analytics", path: "/analytics", icon: "query_stats"},
    {name: "Settings", path: "/settings", icon: "settings"},
]

const NavBar = () => {

    const location = useLocation();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        C.L.A.W.
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="Open Menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map(({name, path, icon}, i) => (
                                <Link key={i} to={path} onClick={handleCloseNavMenu}>
                                    <MenuItem selected={location.pathname == path}>
                                        <ListItemIcon>
                                            <span className="material-symbols-outlined">{icon}</span>
                                        </ListItemIcon>
                                        <ListItemText>{name}</ListItemText>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        C.L.A.W.
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map(({name, path, icon}, i) => (
                            <Link key={i} to={path} onClick={handleCloseNavMenu}>
                                <Button
                                    sx={{ p: 2, color: location.pathname == path ? 'primary' : 'white' }}
                                    startIcon={icon && <span className="material-symbols-outlined">{icon}</span>}
                                >
                                    {name}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <BluetoothStatus />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
      );
}

export default NavBar;