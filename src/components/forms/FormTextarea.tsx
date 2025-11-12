/**
 * @file Reusable FormTextarea component for React Hook Form.
 * @module components/forms/FormTextarea
 */

import { type JSX } from 'react';
import type { FormTextareaProps } from '../../types/forms';
import { cn } from '../../lib/utils/cn'; // Assuming cn utility for class name concatenation

/**
 * A reusable textarea component integrated with React Hook Form.
 * Displays validation errors and supports basic textarea attributes.
 *
 * @template TFormValues The type of the form values object.
 * @param {FormInputProps<TFormValues>} props - The properties for the component.
 * @returns {JSX.Element} The rendered textarea component.
 */
export const FormTextarea = <TFormValues extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  register,
  errors,
  required,
  helperText,
  className,
  ...rest
}: FormTextareaProps<TFormValues>): JSX.Element => {
  const error = errors?.[name];
  const textareaId = `textarea-${String(name)}`;

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={textareaId}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={cn(
          'block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
          'focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400',
          'sm:text-sm',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          rest.disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''
        )}
        rows={4} // Default rows
        {...register(name, { required: required })}
        {...rest}
      />
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {error && (
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
};
