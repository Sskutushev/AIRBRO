/**
 * @file Reusable FormInput component for React Hook Form.
 * @module components/forms/FormInput
 */

import React, { type JSX } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormInputProps } from '../../types/forms';
import { cn } from '../../lib/utils/cn'; // Assuming cn utility for class name concatenation

/**
 * A reusable input component integrated with React Hook Form.
 * Supports various input types, icons, and displays validation errors.
 *
 * @template TFormValues The type of the form values object.
 * @param {FormInputProps<TFormValues>} props - The properties for the component.
 * @returns {JSX.Element} The rendered input component.
 */
export const FormInput = <TFormValues extends Record<string, unknown>>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  errors,
  required,
  helperText,
  className,
  startIcon,
  endIcon,
  showPasswordToggle,
  isPasswordShown,
  onPasswordToggle,
  ...rest
}: FormInputProps<TFormValues>) => {
  const error = errors?.[name];
  const inputId = `input-${String(name)}`;

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {React.cloneElement(startIcon as React.ReactElement, {
              className: 'h-5 w-5 text-gray-400 dark:text-gray-500',
            })}
          </div>
        )}
        <input
          id={inputId}
          type={type === 'password' && showPasswordToggle && isPasswordShown ? 'text' : type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white h-[35px]',
            'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400',
            'sm:text-sm',
            startIcon ? 'pl-10' : '',
            endIcon || (showPasswordToggle && onPasswordToggle) ? 'pr-10' : '',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            'disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed' 
          )}
          {...register(name, { required })}
          {...rest}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {endIcon &&
            React.cloneElement(endIcon as React.ReactElement, {
              className: 'h-5 w-5 text-gray-400 dark:text-gray-500',
            })}
          {showPasswordToggle && onPasswordToggle && (
            <button
              type="button"
              onClick={onPasswordToggle}
              className="ml-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              aria-label={isPasswordShown ? 'Hide password' : 'Show password'}
            >
              {isPasswordShown ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
};
