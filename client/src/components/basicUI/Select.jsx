import React, { useId } from 'react'

function Select({
    options,
    label,
    className = '',
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
            <select
                id={id}
                ref={ref}
                {...props}
                className={`p-3 rounded-md focus:bg-black duration-200 border border-gray-700 w-full ${className}`}
            >
                {options?.map((option) => {
                    // Handle simple string/number options efficiently
                    if (typeof option === 'string' || typeof option === 'number') {
                        return (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        );
                    }

                    // Handle object options with value/label
                    if (option && typeof option === 'object') {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        );
                    }

                    return null;
                })}
            </select>
        </div>
    )
}

export default React.forwardRef(Select);
