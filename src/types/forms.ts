/**
 * @file Helper TypeScript types for form components.
 * @module types/forms
 */

import type { ReactNode } from 'react';

/**
 * Base props for all form fields, providing common properties for integration with React Hook Form.
 * @template TFormValues The type of the form values object.
 */
export interface FormFieldProps<TFormValues extends Record<string, unknown>> {
  /** The unique name of the field, used for registration with React Hook Form. */
  name: keyof TFormValues;
  /** The human-readable label for the form field. */
  label: string;
  /** The register function from `useForm` to register the input with React Hook Form. */
  register: (name: keyof TFormValues, options?: any) => any;
  /** The errors object from `useForm` to display validation messages. */
  errors?: {
    [K in keyof TFormValues]?: {
      type?: string | number;
      message?: string;
    };
  };
  /** Indicates if the field is required. */
  required?: boolean;
  /** Optional helper text to display below the input. */
  helperText?: string;
  /** Optional CSS class names for the input container. */
  className?: string;
}

/**
 * Props specific to text-based input components (e.g., FormInput).
 * @template TFormValues The type of the form values object.
 */
export interface FormInputProps<TFormValues extends Record<string, unknown>>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>, FormFieldProps<TFormValues> {
  /** Optional icon to display at the start of the input. */
  startIcon?: ReactNode;
  /** Optional icon to display at the end of the input. */
  endIcon?: ReactNode;
  /** If true, shows a toggle button for password visibility. */
  showPasswordToggle?: boolean;
  /** Current state of password visibility. */
  isPasswordShown?: boolean;
  /** Callback function to toggle password visibility. */
  onPasswordToggle?: () => void;
}

/**
 * Props specific to textarea components (e.g., FormTextarea).
 * @template TFormValues The type of the form values object.
 */
export interface FormTextareaProps<TFormValues extends Record<string, unknown>>
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>, FormFieldProps<TFormValues> {
  /** Optional icon to display at the start of the input. */
  startIcon?: ReactNode;
  /** Optional icon to display at the end of the input. */
  endIcon?: ReactNode;
  /** If true, shows a toggle button for password visibility. */
  showPasswordToggle?: boolean;
  /** Current state of password visibility. */
  isPasswordShown?: boolean;
  /** Callback function to toggle password visibility. */
  onPasswordToggle?: () => void;
}

/**
 * Represents an option for a select input.
 */
export interface FormSelectOption {
  /** The value of the option. */
  value: string | number;
  /** The display label for the option. */
  label: string;
  /** If true, the option is disabled. */
  disabled?: boolean;
}

/**
 * Props specific to select components (e.g., FormSelect).
 * @template TFormValues The type of the form values object.
 */
export interface FormSelectProps<TFormValues extends Record<string, unknown>>
  extends FormFieldProps<TFormValues> {
  /** An array of options to display in the select dropdown. */
  options: FormSelectOption[];
  /** Optional placeholder text for the select input. */
  placeholder?: string;
  /** Optional disabled state for the select. */
  disabled?: boolean;
}

/**
 * Props specific to checkbox components (e.g., FormCheckbox).
 * @template TFormValues The type of the form values object.
 */
export interface FormCheckboxProps<TFormValues extends Record<string, unknown>>
  extends FormFieldProps<TFormValues> {
  /** Optional disabled state for the checkbox. */
  disabled?: boolean;
}
