// src/components/profile/CoverImagePreview.jsx
function CoverImagePreview({ src }) {
    return (
        <div className="relative h-48 w-full bg-zinc-200 dark:bg-zinc-800">
            <img
                src={src || "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"}
                alt="Cover"
                className="object-cover w-full h-full"
            />
        </div>
    );
}

export default CoverImagePreview;