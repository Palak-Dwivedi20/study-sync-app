import SearchBar from './SearchBar';
import { FaBars } from "react-icons/fa6";
import { IoSchool, IoNotificationsSharp } from "react-icons/io5";
import { useSidebar } from '../../contexts/SidebarContext';
import { useSelector } from 'react-redux';
import Button from './Button';
import ProfileLogo from '../profile/ProfileLogo';
import { useModalQuery } from '../../hooks/useModalQuery ';

function Header() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    const { setModal } = useModalQuery();

    const sidebar = (() => {
        try {
            return useSidebar();
        } catch {
            return null;
        }
    })();



    return (
        <header className='sticky top-0 left-0 right-0 z-40'>
            <nav className="bg-black text-white h-15 shadow-sm py-2 px-4 flex justify-between items-center">
                <div className='flex p-2 gap-5'>
                    {isAuthenticated && sidebar?.toggleSidebar && (
                        <button
                            type='button'
                            aria-label='Toggle Sidebar'
                            className='text-2xl text-white hover:text-gray-300 duration-300 outline-none cursor-pointer'
                            onClick={sidebar?.toggleSidebar}
                        >
                            <FaBars />
                        </button>
                    )}

                    <div className='flex gap-1'>
                        <IoSchool className='text-3xl text-white' />
                        <h1 className="text-2xl font-bold text-white">StudySync</h1>
                    </div>
                </div>

                <div className='w-70 lg:w-1/2'>
                    <SearchBar placeholder='Search . . .' className='bg-zinc-900 rounded-full border border-gray-700' />
                </div>

                <div className='flex justify-center items-center gap-10'>
                    <div>
                        <IoNotificationsSharp className='text-3xl text-white cursor-pointer' />
                    </div>

                    {
                        !isAuthenticated ? (
                            <div className='flex items-center text-xl hover:bg-gray-900 py-2 px-4'>
                                <Button
                                    title='Login'
                                    onClick={() => setModal("login")}
                                    className="font-medium text-white"
                                />
                            </div>

                        ) : (
                            <ProfileLogo />
                        )
                    }
                </div>

            </nav>
        </header>
    )
}

export default Header;