/**
 * @file Reusable FormSelect component for React Hook Form.
 * @module components/forms/FormSelect
 */

import { type JSX } from 'react';
import type { FormSelectProps } from '../../types/forms';
import { cn } from '../../lib/utils/cn'; // Assuming cn utility for class name concatenation

/**
 * A reusable select (dropdown) component integrated with React Hook Form.
 * Displays validation errors and supports a list of options.
 *
 * @template TFormValues The type of the form values object.
 * @param {FormSelectProps<TFormValues>} props - The properties for the component.
 * @returns {JSX.Element} The rendered select component.
 */
export const FormSelect = <TFormValues extends Record<string, any>>({
  name,
  label,
  options,
  placeholder,
  register,
  errors,
  required,
  helperText,
  className,
  disabled,
  ...rest
}: FormSelectProps<TFormValues>): JSX.Element => {
  const error = errors?.[name];
  const selectId = `select-${String(name)}`;

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
            'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400',
            'sm:text-sm',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
          )}
          {...register(name, { required: required })}
          disabled={disabled}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Optional: Add a custom arrow icon for the select dropdown */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
};
