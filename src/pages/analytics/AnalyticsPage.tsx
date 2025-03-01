import PageTitle from "../../components/ui/PageTitle";

const AnalyticsPage = () => {
    return (
        <div className="w-full h-full px-4 flex flex-col items-center relative">
            <PageTitle>Analytics</PageTitle>
            
            <div className="mt-4 italic">Please select a team to analyze</div>
        </div>
    )
}

export default AnalyticsPage;