import { Header, Sidebar } from '../components/ComponentImport';
import { useSidebar } from '../contexts/SidebarContext';


function AppLayout({ children }) {

    const { isSidebarOpen, toggleSidebar, isDesktop } = useSidebar();


    return (
        <div className="h-screen overflow-hidden bg-black">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 w-full h-15 shadow z-10">
                <Header />
            </nav>

            {/* Mobile Sidebar + Backdrop */}

            {
                !isDesktop && (
                    <div>
                        {/* Backdrop  */}
                        {
                            isSidebarOpen && (
                                <div className='fixed inset-0 backdrop-brightness-40 z-1'
                                    onClick={toggleSidebar}
                                >
                                </div>
                            )
                        }

                        {/* Sidebar */}
                        <aside
                            className={`w-56 overflow-y-auto min-h-[calc(100vh-60px)] fixed top-15 left-0 z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                                } transition-transform duration-300 ease-in-out shadow no-scrollbar`}
                        >
                            <div>
                                <Sidebar
                                // isSidebarOpen={isSidebarOpen}
                                // toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                />
                            </div>
                        </aside>

                    </div>
                )
            }



            {/* Desktop Sidebar  + Main Content */}
            {
                isDesktop && (
                    // Sidebar 
                    < aside
                        className={`overflow-y-auto min-h-[calc(100vh-60px)] fixed top-15 left-0 shadow z-10 no-scrollbar`}>
                        <div>
                            <Sidebar
                            // isSidebarOpen={isSidebarOpen}
                            // toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                            />
                        </div>
                    </aside>
                )
            }


            {/* Main Content */}
            <main
                className={`flex-1 pt-15 h-full transition-all duration-300 overflow-y-auto min-h-[calc(100vh-60px)] ${isDesktop ? (isSidebarOpen ? 'ml-56' : 'ml-20') : ''}`}
            >
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
