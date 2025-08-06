import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserProfile } from "../../features/profileSlice";
import { HiCheckBadge, HiUserCircle } from "react-icons/hi2";
import { FaRegEdit, FaUser } from "react-icons/fa";
import { Loader } from "../../components/ComponentImport";


function Profile() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUserProfile());
    }, [dispatch]);

    const {
        currentUserProfile: user,
        currentUserLoading,
        currentUserError
    } = useSelector(state => state.profile);



    if (currentUserLoading) {
        return <Loader />;
    }

    if (currentUserError) {
        return <div className="text-center mt-10 text-red-500">{currentUserError}</div>;
    }

    if (!user) return null; // or show fallback



    return (
        <div className="max-w-3xl mx-auto mt-8 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900">
            {/* Cover Image */}
            <div className="relative h-48 w-full bg-zinc-200 dark:bg-zinc-800">
                {user.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400">
                        No Cover Image
                    </div>
                )}

                {/* Avatar */}
                <div className="absolute -bottom-12 left-6">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full border dark:border-gray-700 object-cover shadow"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full border dark:border-gray-700 bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center shadow">
                            <FaUser  className="w-15 h-15 text-zinc-500 dark:text-zinc-400" />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-16 pb-8 px-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl text-zinc-700 dark:text-zinc-300 font-bold">
                        {user.fullName}
                    </h1>
                    {user.isVerified && (
                        <HiCheckBadge className="text-blue-600" size={20} title="Verified" />
                    )}
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">@{user.username}</p>

                {user.bio && (
                    <p className="mt-4 text-zinc-700 dark:text-zinc-300">{user.bio}</p>
                )}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</h3>
                        <p className="mt-1 text-zinc-900 dark:text-zinc-100">{user.email}</p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</h3>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${user.role === "groupleader"
                            ? "bg-blue-600 text-white"
                            : "bg-green-600 text-white"
                            }`}>
                            {user.role}
                        </span>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Joined Groups</h3>
                        <p className="mt-1 text-zinc-900 dark:text-zinc-100">{user.joinedGroups?.length || 0}</p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Joined Date</h3>
                        <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;