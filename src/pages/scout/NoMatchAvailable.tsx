import { Link } from "react-router-dom";


const NoMatchAvailable = () => {
    
    return (
        <div className="w-full h-full flex flex-col p-4 justify-center items-center text-center">
            <h1 className="text-3xl">No matches to scout!</h1>
            <span className="text-lg">Go to the <Link to='/schedule' className="underline">Schedule Page</Link> to download the schedule</span>
        </div>
    );
};
  
export default NoMatchAvailable;
