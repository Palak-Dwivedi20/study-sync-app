import { Outlet } from "react-router";

const QuizLayout = () => {

    return (
        <div className="flex-1 min-h-[calc(100vh-60px)] h-full overflow-y-auto transition-all duration-300">
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default QuizLayout;
