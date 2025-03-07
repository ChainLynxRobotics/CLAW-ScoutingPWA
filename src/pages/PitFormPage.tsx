import { Link } from "@mui/material";
import QrCodeType from "../enums/QrCodeType";
import PageTitle from "../components/ui/PageTitle";

const PitFormPage = () => {

    return (
        <div className="w-full flex flex-col items-center gap-5 px-4">
            <PageTitle>Pit Scouting</PageTitle>
            
            <Link 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdB9mOA7j06EN1DZSVLvu36n3y33l504-r0yqsjeZb5jltV2w/viewform?usp=dialog" 
                target="_blank"
            >
                Pit Scouting Form - Google Forms
            </Link>
        </div>
    )
};

export default PitFormPage;