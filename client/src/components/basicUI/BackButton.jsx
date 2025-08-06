import { useLocation, useNavigate } from "react-router";
import Button from "./Button";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";


function BackButton({ pathname, className }) {

    const location = useLocation();
    const navigate = useNavigate();

    const showBackButton = location.pathname !== `${pathname}`;

    return (
        <div className={`text-lg ${className}`}>
            {showBackButton && (
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-1 cursor-pointer text-blue-500 hover:text-blue-700"
                >
                    <HiOutlineArrowLeftCircle size={25} />
                    <span>Back</span>
                </button>
            )}
        </div>
    )
}

export default BackButton
