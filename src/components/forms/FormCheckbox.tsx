/**
 * @file Reusable FormCheckbox component for React Hook Form.
 * @module components/forms/FormCheckbox
 */

import { type JSX } from 'react';
import type { FormCheckboxProps } from '../../types/forms';
import { cn } from '../../lib/utils/cn'; // Assuming cn utility for class name concatenation

/**
 * A reusable checkbox component integrated with React Hook Form.
 * Supports custom styling and displays validation errors.
 *
 * @template TFormValues The type of the form values object.
 * @param {FormCheckboxProps<TFormValues>} props - The properties for the component.
 * @returns {JSX.Element} The rendered checkbox component.
 */
export const FormCheckbox = <TFormValues extends Record<string, unknown>>({
  name,
  label,
  register,
  errors,
  required,
  className,
  disabled,
  ...rest
}: FormCheckboxProps<TFormValues>): JSX.Element => {
  const error = errors?.[name];
  const checkboxId = `checkbox-${String(name)}`;

  return (
    <div className={cn('relative flex items-start', className)}>
      <div className="flex items-center h-5">
        <input
          id={checkboxId}
          type="checkbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
            'dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500 dark:focus:ring-blue-400',
            error ? 'border-red-500 focus:ring-red-500' : '',
            disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
          )}
          {...register(name, { required: required })}
          disabled={disabled}
          {...rest}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={checkboxId} className="font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};
