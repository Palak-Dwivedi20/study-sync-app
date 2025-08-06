// src/components/profile/AvatarPreview.jsx
function AvatarPreview({ src }) {
    return (
        <div className="relative">
            <div className="absolute -bottom-12 left-6">
                <img
                    src={src || "https://i.pravatar.cc/300?img=12"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow"
                />
            </div>
        </div>
    );
}

export default AvatarPreview;