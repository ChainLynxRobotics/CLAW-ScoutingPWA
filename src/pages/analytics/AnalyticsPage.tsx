import { Divider, Link } from "@mui/material";
import PageTitle from "../../components/ui/PageTitle";

const AnalyticsPage = () => {
    return (
        <div className="w-full h-full px-4 flex flex-col items-center relative gap-5">
            <PageTitle>Analytics</PageTitle>
            
            <div className="italic">Please select a team to analyze</div>

            <Divider className="w-full max-w-lg !mt-12" />

            <div className="text-lg">Additional Links</div>

            <Link 
                href="https://docs.google.com/forms/d/1V-SpHQ0olgZi1fWMiUR7x_luLOGnyjINC1vmo4n2eLM/edit#responses" 
                target="_blank"
            >
                Pit Scouting Form Responses
            </Link>

            <Link 
                href="https://docs.google.com/document/d/1U4gcB4k804L8CjFWNV0ffgGN5dEYD69XxqBxu5Zz3IE/edit?tab=t.0" 
                target="_blank"
            >
                Prescouting Sheet
            </Link>
        </div>
    )
}

export default AnalyticsPage;