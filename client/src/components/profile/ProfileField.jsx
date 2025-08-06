// src/components/profile/ProfileField.jsx
function ProfileField({ label, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
        </div>
    );
}

export default ProfileField;