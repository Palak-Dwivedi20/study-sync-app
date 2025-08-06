import { useLocation, useNavigate } from "react-router";

const useModalQuery = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract current modal from query params
    const getModalType = () => {
        const params = new URLSearchParams(location.search);
        return params.get("modal"); // e.g., "login" or "signup"
    };

    const setModal = (type) => {
        const params = new URLSearchParams(location.search);
        if (type) {
            params.set("modal", type); // Set modal=login or modal=signup
        } else {
            params.delete("modal"); // Remove modal if needed
        }
        navigate(`${location.pathname}?${params.toString()}`);
    };

    return {
        modalType: getModalType(),
        setModal,
    };
};

export { useModalQuery };