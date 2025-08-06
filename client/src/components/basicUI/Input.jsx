import React, { useId } from 'react'

function Input({
    label,
    type = "text",
    name,
    placeholder = "",
    className = "",
    ...props
}, ref) {

    const id = useId();
    return (
        <div className='w-full'>
            {label && <label
                className='inline-block p-1 font-medium'
                htmlFor={id}>
                {label}
            </label>
            }
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                className={`w-full p-3 border border-gray-700 rounded-md ${className}`}
                ref={ref}
                {...props}
            />
        </div>
    )
}

export default React.forwardRef(Input);
