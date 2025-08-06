import React, { useId } from 'react'

function Textarea({
    label,
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
            <textarea
                id={id}
                name={name}
                placeholder={placeholder}
                className={`w-full p-3 border border-gray-700 rounded-md resize-none ${className}`}
                ref={ref}
                {...props}
            />
        </div>
    )
}

export default React.forwardRef(Textarea)
