import { SnackbarProvider, SnackbarProviderProps } from "notistack";
import { Outlet } from "react-router-dom";
import SnackbarCloseButton from "../components/ui/SnackbarCloseButton";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ui/ErrorFallback";
import NavBar from "../components/NavBar";

const snackbarProps: SnackbarProviderProps = {
    maxSnack: 3,
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
    },
    autoHideDuration: 6000,
    preventDuplicate: true,
    action: snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />
};

const Layout = () => {
    return (
        <SnackbarProvider {...snackbarProps}>
            <div className="w-full h-dvh relative flex flex-col overflow-hidden">
                <NavBar />
                <div className="w-full h-full overflow-y-auto">
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <Outlet />
                    </ErrorBoundary>
                </div>
            </div>
        </SnackbarProvider>
    )
};

export default Layout;
