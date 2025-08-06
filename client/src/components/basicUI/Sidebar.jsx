import { FaStickyNote, FaUsers, FaQuestionCircle, FaSignOutAlt, FaThLarge, FaCog } from 'react-icons/fa';
import { MdQuiz } from "react-icons/md";
import { NavLink } from 'react-router';
import { useSidebar } from '../../contexts/SidebarContext';


function Sidebar() {
    const { isSidebarOpen } = useSidebar();

    const Menus = [
        { title: "Dashboard", icon: <FaThLarge />, path: "/dashboard" },
        { title: "Notes", icon: <FaStickyNote />, path: "/notes" },
        { title: "Groups", icon: <FaUsers />, path: "/groups" },
        { title: "Doubts", icon: <FaQuestionCircle />, path: "/doubts" },
        { title: "Quiz", icon: <MdQuiz />, path: "/quiz" },
        { title: "Setting", icon: <FaCog />, path: "/setting" },
    ];

    return (
        <div>
            <div className={`flex flex-col justify-between bg-black text-white min-h-[calc(100vh-60px)] p-4 pt-5 ${isSidebarOpen ? 'w-56' : 'w-20'} duration-300`}>
                <nav className={`flex flex-col gap-4 text-lg pt-2 h-full`}>
                    {Menus.map((menu, index) => (
                        <NavLink
                            to={menu.path}
                            key={index}
                            className={({ isActive }) => `flex items-center gap-3 w-full ${isActive ? 'bg-zinc-900' : 'bg-black'} hover:bg-zinc-900 p-2 rounded-md`}>
                            <span
                                data-tooltip-id={!isSidebarOpen ? 'sidebar-tooltip' : undefined}
                                data-tooltip-content={!isSidebarOpen ? menu.title : undefined}
                                data-tooltip-place='right'
                                className='text-xl block'
                            >
                                {menu.icon ? menu.icon : <FaThLarge />}
                            </span>
                            <span className={`text-base ${!isSidebarOpen && 'hidden'} duration-300`}>{menu.title}</span>
                        </NavLink>
                    ))}
                </nav>

                <button
                    aria-label='Logout'
                    // disabled={loading}
                    className="flex items-center gap-3 text-white hover:bg-zinc-900 p-2 rounded-md cursor-pointer"
                >
                    <span
                        className='text-xl block'
                        data-tooltip-id={!isSidebarOpen ? 'sidebar-tooltip' : undefined}
                        data-tooltip-content={!isSidebarOpen ? 'Logout' : undefined}
                    >
                        <FaSignOutAlt />
                    </span>
                    <span className={`text-base ${!isSidebarOpen && 'hidden'} duration-500`}>
                        {"Log Out"}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
