import React from 'react'
import { IoIosSearch } from "react-icons/io";

function SearchBar({
    type = "text",
    placeholder = "",
    className = "",
    ...props
}) {

    return (
        <div className="flex items-center">
            <div className="relative w-full">
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 bg-zinc-900 rounded-full border border-gray-700 ${className}`}
                    autoComplete="off"
                    {...props}
                />
                <IoIosSearch
                    className="absolute right-0 top-0 h-full w-14 px-3 border-r-gray-600 border-t-gray-600 border-b-gray-600 text-gray-50 bg-zinc-600 rounded-r-full"
                />
                {/* <svg
                    className="absolute right-0 top-0 h-full w-14 border-r-gray-700 border-t-gray-700 border-b-gray-700 text-gray-50 bg-zinc-600 rounded-r-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="-5 -5 35 35"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg> */}
            </div>
        </div>
    )
}

export default SearchBar;
