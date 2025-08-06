import React, { useId } from 'react'

function Radiobutton({
    label,
    type = "radio",
    value,
    className = "",
    ...props
}, ref) {

    const id = useId();
    return (
        <div className='w-full'>
            <input
                type={type}
                value={value}
                id={id}
                className={`size-4 ${className}`}
                ref={ref}
                {...props}
            />
            {label && <label
                className='inline-block p-2 font-medium text-gray-800'
                htmlFor={id}>
                {label}
            </label>
            }
        </div>
    )
}

export default React.forwardRef(Radiobutton)
