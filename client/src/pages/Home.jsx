import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router';
import { FaUsers, FaQuestionCircle } from 'react-icons/fa';
import { GrNotes } from "react-icons/gr";
import { Header, Footer, LoginForm, SignupForm } from '../components/ComponentImport';


function Home() {

    const location = useLocation();
    const navigate = useNavigate();
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get("modal");
        if (type === "login" || type === "signup") {
            setModalType(type);
        } else {
            setModalType(null);
        }
    }, [location.search]);

    // Close modal and remove ?modal=... from URL
    const closeModal = () => {
        setModalType(null);
        const params = new URLSearchParams(location.search);
        params.delete("modal");
        navigate(`${location.pathname}`, { replace: true });
    };


    return (
        <>
            <header>
                <Header />
            </header>

            {modalType === "login" && <LoginForm key="login" onClose={closeModal} />}
            {modalType === "signup" && <SignupForm key="signup" onClose={closeModal} />}

            <div className="min-h-screen h-full bg-[url(/group-study.webp)] bg-no-repeat bg-cover bg-center text-gray-800 border-b border-t border-gray-600">

                <div className='bg-[#000000bf] min-h-screen h-full w-full'>


                    <main className="px-6 py-20 max-w-lg mx-auto text-center">


                        <h1 className="text-5xl font-bold mb-10 leading-tight text-white">Smart Study</h1>
                        <h2 className="text-3xl font-bold mb-8 leading-tight text-white">Collaborate. Learn. Succeed.</h2>

                        <p className="text-lg text-gray-300 mb-10">
                            StudySync is your all-in-one academic hub. Share notes, solve doubts, join study groups and grow together.
                        </p>

                        <Link to="/dashboard" className="inline-block bg-blue-800 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-900 transition duration-200">
                            Explore Dashboard
                        </Link>

                    </main>

                    <section className="py-10 px-4 mb-5 shadow-inner">
                        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">

                            <div>
                                <GrNotes className="mx-auto h-12 mb-2 text-4xl text-white" />

                                <h3 className="text-xl text-white font-semibold mb-1">Share Notes</h3>
                                <p className="text-sm text-gray-300">Upload and download course notes anytime.</p>
                            </div>

                            <div>
                                <FaQuestionCircle className="mx-auto h-12 mb-2 text-3xl text-white" />
                                <h3 className="text-xl text-white font-semibold mb-1">Clear Doubts</h3>
                                <p className="text-sm text-gray-300">Ask questions and get help from peers.</p>
                            </div>

                            <div>
                                <FaUsers className="mx-auto h-12 mb-2 text-3xl text-white" />
                                <h3 className="text-xl text-white font-semibold mb-1">Join Groups</h3>
                                <p className="text-sm text-gray-300">Create or join groups for collaborative study.</p>
                            </div>

                        </div>
                    </section>
                </div>
            </div>

            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default Home;
