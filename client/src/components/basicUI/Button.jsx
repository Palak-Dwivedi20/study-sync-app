import React from 'react'

function Button({
    title = "",
    className = "",
    ...props
}) {
    return (
        <div>
            <button
                className={`rounded cursor-pointer duration-500 ${className}`}
                {...props}
            >
                {title}
            </button>
        </div>
    )
}

export default Button;
