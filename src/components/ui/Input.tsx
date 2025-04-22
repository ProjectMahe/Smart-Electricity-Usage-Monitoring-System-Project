import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const inputClasses = `
      block rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm 
      ring-1 ring-inset ${error ? 'ring-red-500' : 'ring-gray-300'} 
      placeholder:text-gray-400 
      focus:ring-2 focus:ring-inset focus:ring-blue-600 
      ${error ? 'focus:ring-red-500' : ''} 
      sm:text-sm sm:leading-6
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900 mb-1">
            {label}
          </label>
        )}
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;