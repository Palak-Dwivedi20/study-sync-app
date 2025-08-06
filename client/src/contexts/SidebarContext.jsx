import { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLocation } from 'react-router';

const SidebarContext = createContext();

export const SidebarContextProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const location = useLocation();


    //Manual toggle
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };


    // Auto open/close based on screen size
    useEffect(() => {
        if (hasMounted) {
            isDesktop ? setIsSidebarOpen(true) : setIsSidebarOpen(false);
        } else {
            setHasMounted(true);
        }
    }, [isDesktop, hasMounted]);


    // Auto close on route change (for mobile)
    useEffect(() => {
        if (!isDesktop) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname, isDesktop]);


    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, isDesktop }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);
