import { Button, ButtonGroup } from "@mui/material"
import { Link, useLocation } from "react-router-dom";

const ScoutNavBar = () => {

    const location = useLocation();

    return (
        <div className="fixed bottom-8 w-full flex justify-center">
            <ButtonGroup variant="contained" color="primary" size="large" aria-label="Basic button group" sx={{background: "var(--background)"}}>
                <Link to="/scout">
                    <Button disabled={location.pathname === "/scout"}>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined">flag</span>
                            <span>Pre</span>
                        </div>
                    </Button>
                </Link>
                <Link to="/scout/auto">
                    <Button disabled={location.pathname === "/scout/auto"}>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined">smart_toy</span>
                            <span>Auto</span>
                        </div>
                    </Button>
                </Link>
                <Link to="/scout/teleop">
                    <Button disabled={location.pathname === "/scout/teleop"}>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined">cell_tower</span>
                            <span>TeleOp</span>
                        </div>
                    </Button>
                </Link>
                <Link to="/scout/post">
                    <Button disabled={location.pathname === "/scout/post"}>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined">sports_score</span>
                            <span>Post</span>
                        </div>
                    </Button>
                </Link>
            </ButtonGroup>
        </div>
    )
}

export default ScoutNavBar;
