import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router';
import { toast } from 'react-toastify';
import { Loader, ProfileForm } from '../../components/ComponentImport';
import { updateUserDetails, updateUserAvatar, updateUserCoverImage } from '../../features/profileSlice';

function CompleteProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        user,
        isAuthLoading,
        isAuthenticated,
        isProfileCompleted
    } = useSelector(state => state.auth);

    // Form default values
    const defaultValues = {
        fullName: user?.fullName || '',
        email: user?.email || '',
        username: user?.username || '',
        bio: user?.bio || ''
    };

    const handleProfileSubmit = async (data) => {
        try {
            await dispatch(updateUserDetails({
                fullName: data.fullName,
                email: data.email,
                username: data.username,
                bio: data.bio
            })).unwrap();

            if (data.avatarFile) {
                await dispatch(updateUserAvatar(data.avatarFile)).unwrap();
            }

            if (data.coverFile) {
                await dispatch(updateUserCoverImage(data.coverFile)).unwrap();
            }

            toast.success("Profile completed successfully ✅");
            navigate("/dashboard");
        } catch (err) {
            const errorMsg = err?.response?.data?.message || "Profile update failed";
            toast.error(errorMsg);
        }
    };

    if (isAuthLoading) return <Loader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (isProfileCompleted) return <Navigate to="/dashboard" replace />;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Profile</h2>
            <ProfileForm
                defaultValues={defaultValues}
                avatarUrl={user?.avatar}
                coverUrl={user?.coverImage}
                onSubmit={handleProfileSubmit}
            />
        </div>
    );
}

export default CompleteProfile;
