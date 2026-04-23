"use client";

import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    icon?: React.ReactNode;
    sm?: boolean;
}

export const InputField = ({
    label, name, type = 'text', value, onChange, placeholder,
    required = false, disabled = false, error, className = '',
    helpText, icon, sm = false, maxLength, style = {}, ...rest
}: InputFieldProps) => (
    <div className={`mb-3 ${className}`}>
        {label && (
            <label htmlFor={name} className="block font-medium" style={{ color: 'var(--text-main)', fontSize: sm ? '0.85rem' : undefined }}>
                {label} {required && <span className="text-red-500">*</span>}
                {helpText && <span className="text-[var(--text-muted)] font-normal ml-1" style={{ fontSize: '0.8rem' }}>({helpText})</span>}
            </label>
        )}
        <div className={type === 'date' ? 'premium-date-input' : ''} style={{ position: 'relative' }}>
            {icon && (
                <div style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<unknown>, { size: 16 } as React.Attributes & { size?: number }) : icon}
                </div>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                className="w-full"
                style={{
                    background: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                    border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: sm ? '10px 14px' : '12px 16px',
                    paddingLeft: icon ? '40px' : undefined,
                    ...style
                }}
                {...rest}
            />
        </div>
        {error && <small className="text-red-500">{error}</small>}
    </div>
);

interface SelectOption {
    label?: string;
    value?: string;
}

interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
    label?: string;
    options?: (SelectOption | string)[];
    error?: string;
    placeholder?: string;
}

export const SelectField = ({
    label, name, value, onChange, options = [],
    placeholder = 'Select...', required = false, disabled = false,
    error, className = '', ...rest
}: SelectFieldProps) => (
    <div className={`mb-3 ${className}`}>
        {label && (
            <label htmlFor={name} className="block font-medium" style={{ color: 'var(--text-main)' }}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-full"
            style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px 16px'
            }}
            {...rest}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                return (
                    <option key={optValue} value={optValue}>
                        {optLabel}
                    </option>
                );
            })}
        </select>
        {error && <small className="text-red-500">{error}</small>}
    </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    sm?: boolean;
}

export const TextAreaField = ({
    label, name, value, onChange, placeholder, rows = 4,
    required = false, disabled = false, error, className = '', sm = false, ...rest
}: TextAreaFieldProps) => (
    <div className={`mb-3 ${className}`}>
        {label && (
            <label htmlFor={name} className="block font-medium" style={{ color: 'var(--text-main)', fontSize: sm ? '0.85rem' : undefined }}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            disabled={disabled}
            className="w-full"
            style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: sm ? '10px 14px' : '12px 16px',
                resize: 'vertical'
            }}
            {...rest}
        />
        {error && <small className="text-red-500">{error}</small>}
    </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button = ({
    children, variant = 'primary', type = 'button', onClick,
    disabled = false, loading = false, fullWidth = false, className = '', style = {}, ...rest
}: ButtonProps) => {
    const variants = {
        primary: { background: 'var(--primary-500)', color: 'white' },
        secondary: { background: 'var(--bg-surface)', color: 'var(--text-main)' },
        success: { background: '#22c55e', color: 'white' },
        danger: { background: '#ef4444', color: 'white' },
        outline: { background: 'transparent', border: '2px solid var(--primary-500)', color: 'var(--primary-500)' }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${fullWidth ? 'w-full' : ''} ${className}`}
            style={{
                ...variants[variant],
                borderRadius: '9999px',
                padding: '12px 24px',
                fontWeight: 600,
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style
            }}
            {...rest}
        >
            {loading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full mr-2" role="status" />
            ) : null}
            {children}
        </button>
    );
};

export const Panel = ({ children, className = '', style = {} }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={className}
        style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            ...style
        }}
    >
        {children}
    </div>
);
