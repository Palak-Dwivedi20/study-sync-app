import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, setAuthChecked } from "./features/authSlice";
import { Loader } from "./components/ComponentImport";


const AppInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const { isLoading, isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
    useEffect(() => {
        if (!isAuthChecked) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, isAuthChecked]);

    if (!isAuthChecked || isLoading) return <Loader />;

    return children;
};

export default AppInitializer;
