import { Outlet } from 'react-router'
import AppLayout from './layout/AppLayout';
import { Tooltip } from 'react-tooltip';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContextProviders from './contexts/AppContextProviders.jsx'
import { useSelector } from "react-redux";


function App() {


    return (
        <>
            {<Tooltip id='sidebar-tooltip' place='right' offset={50} className='!bg-gray-800 !text-white' opacity={1} />}

            <AppContextProviders>
                <ToastContainer position="top-right" autoClose={3000} />
                <AppLayout>
                    <Outlet />
                </AppLayout>
            </AppContextProviders>
        </>
    )
}

export default App


