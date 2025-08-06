import React, { useId } from 'react'

function Checkbox({
    label,
    type = "checkbox",
    className = "",
    ...props
}, ref) {

    const id = useId();
    return (
        <div className='w-full'>
            <input
                type={type}
                id={id}
                className={`size-4 border rounded-md ${className}`}
                ref={ref}
                {...props}
            />
            {label && <label
                className={`inline-block p-2 font-medium text-gray-800 ${className}`}
                htmlFor={id}>
                {label}
            </label>
            }
        </div>
    )
}

export default React.forwardRef(Checkbox)
