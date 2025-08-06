import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useClickOutside } from "../../hooks/useClickOutside";


function ProfileLogo() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setOpen(false));

  const toggleDropdown = () => setOpen((prev) => !prev);

  const goToProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile`);
    setOpen(false);
  };

  const goToUpdate = (e) => {
    e.stopPropagation();
    navigate('/update-profile');
    setOpen(false);
  };


  const getInitials = (fullName) => {
    if (!fullName) return "U";

    const words = fullName.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    if (words.length === 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };



  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-11 h-11 rounded-full bg-yellow-700 text-white flex items-center justify-center cursor-pointer select-none text-lg font-semibold uppercase"
        onClick={toggleDropdown}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-full h-full rounded-full border border-gray-600 object-cover"
          />
        ) : (
          getInitials(user?.fullName)
        )}
      </div>

      {open && (
        <div className="absolute right-4 mt-2 p-2 w-48 bg-zinc-900 text-white border border-gray-700 rounded-md shadow-lg z-50 py-2 text-sm">
          <div className="bg-zinc-800 rounded-md flex flex-col justify-center items-center gap-2 py-4 mb-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-25 h-25 rounded-full border border-gray-700 object-cover"
              />
            ) : (
              getInitials(user?.fullName)
            )}

            <h2 className="text-lg text-center">{user?.fullName}</h2>
          </div>

          <button
            onClick={goToProfile}
            className="w-full text-left px-2 py-4 mt-2 hover:bg-zinc-800 rounded-md cursor-pointer"
          >
            👤 View Profile
          </button>
          <button
            onClick={goToUpdate}
            className="w-full text-left px-2 py-4 mt-2 hover:bg-zinc-800 rounded-md cursor-pointer"
          >
            ✏️ Update Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileLogo;
