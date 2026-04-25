"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Calendar } from 'lucide-react';

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
}: InputFieldProps) => {
    const paddingX = '28px'; // Increased for 'airy' feel
    const paddingY = sm ? '16px' : '18px'; // Increased for premium feel

    return (
        <div className={`mb-6 ${className}`}>
            {label && (
                <label htmlFor={name} className="block font-bold mb-2.5 text-sm transition-colors" style={{ color: 'var(--text-main)' }}>
                    {label} {required && <span className="text-red-500">*</span>}
                    {helpText && <span className="text-[var(--text-muted)] font-normal ml-1" style={{ fontSize: '0.75rem' }}>({helpText})</span>}
                </label>
            )}
            <div className={`relative group transition-all duration-300 ${type === 'date' ? 'premium-date-input' : ''}`}>
                {icon && (
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors pointer-events-none z-10">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<unknown>, { size: 20 } as React.Attributes & { size?: number }) : icon}
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
                    className={`w-full transition-all duration-300 outline-none border ${error ? 'border-red-500' : 'border-border-color'} hover:border-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10`}
                    style={{
                        background: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                        borderRadius: '20px', // More rounded for premium feel
                        paddingTop: paddingY,
                        paddingBottom: paddingY,
                        paddingLeft: icon ? '60px' : paddingX,
                        paddingRight: type === 'date' ? '54px' : paddingX,
                        fontSize: '15px',
                        fontWeight: '500',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
                        ...style
                    }}
                    {...rest}
                />
                {type === 'date' && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors pointer-events-none z-10">
                        <Calendar size={18} />
                    </div>
                )}
            </div>
            {error && <small className="text-red-500 mt-1.5 block font-semibold animate-fadeIn">{error}</small>}
        </div>
    );
};

interface SelectOption {
    label?: string;
    value?: string;
}

interface SelectFieldProps {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options?: (SelectOption | string)[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export const SelectField = ({
    label, name, value, onChange, options = [],
    placeholder = 'Select...', required = false, disabled = false,
    error, className = ''
}: SelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => {
        const optValue = typeof opt === 'string' ? opt : opt.value;
        return String(optValue) === String(value);
    });

    const displayLabel = selectedOption 
        ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
        : placeholder;

    const handleSelect = (val: string) => {
        if (onChange) {
            // Simulate native event for compatibility with useForm and other hooks
            const event = {
                target: { name, value: val },
                currentTarget: { name, value: val }
            } as unknown as React.ChangeEvent<HTMLSelectElement>;
            onChange(event);
        }
        setIsOpen(false);
    };

    return (
        <div className={`mb-5 relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block font-semibold mb-2 text-sm" style={{ color: 'var(--text-main)' }}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between cursor-pointer outline-none transition-all duration-300 border ${isOpen ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-border-color'} ${error ? 'border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-text-muted'}`}
                style={{
                    background: 'var(--bg-surface)',
                    color: value ? 'var(--text-main)' : 'var(--text-muted)',
                    borderRadius: '20px',
                    paddingTop: '18px',
                    paddingBottom: '18px',
                    paddingLeft: '28px',
                    paddingRight: '28px',
                }}
            >
                <span className="truncate font-semibold text-[15px]">{displayLabel}</span>
                <ChevronDown 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : 'text-text-muted'}`} 
                    size={22} 
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute left-0 right-0 z-[100] p-2 bg-[var(--bg-card)] border border-border-color shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[24px] backdrop-blur-xl overflow-hidden"
                    >
                        <div className="overflow-y-auto max-h-[280px] pr-1 custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="p-4 text-center text-text-muted text-sm italic">No options available</div>
                            ) : (
                                options.map((opt, idx) => {
                                    const optValue = typeof opt === 'string' ? opt : opt.value;
                                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                                    const isSelected = String(optValue) === String(value);

                                    return (
                                        <div
                                            key={String(optValue) || idx}
                                            onClick={() => handleSelect(String(optValue) || '')}
                                            className={`flex items-center justify-between px-6 py-3 rounded-[12px] cursor-pointer transition-all duration-200 mb-1 last:mb-0 ${isSelected ? 'bg-primary-500/10 text-primary-500' : 'text-text-main hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                                        >
                                            <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{optLabel}</span>
                                            {isSelected && <Check size={16} />}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {error && <small className="text-red-500 mt-1 block font-medium animate-fadeIn">{error}</small>}
        </div>
    );
};


interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    sm?: boolean;
}

export const TextAreaField = ({
    label, name, value, onChange, placeholder, rows = 4,
    required = false, disabled = false, error, className = '', sm = false, ...rest
}: TextAreaFieldProps) => (
    <div className={`mb-6 ${className}`}>
        {label && (
            <label htmlFor={name} className="block font-bold mb-2.5 text-sm" style={{ color: 'var(--text-main)', fontSize: sm ? '0.85rem' : undefined }}>
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
            className={`w-full outline-none transition-all duration-300 border focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 ${error ? 'border-red-500' : 'border-border-color'} hover:border-text-muted`}
            style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-main)',
                borderRadius: '20px',
                paddingTop: '20px',
                paddingBottom: '20px',
                paddingLeft: '28px',
                paddingRight: '28px',
                fontSize: '15px',
                fontWeight: '500',
                resize: 'vertical',
                minHeight: '140px'
            }}
            {...rest}
        />
        {error && <small className="text-red-500 mt-1.5 block font-semibold">{error}</small>}
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
        primary: { background: 'var(--primary-main)', color: 'white' },
        secondary: { background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-main)' },
        success: { background: '#10b981', color: 'white' },
        danger: { background: '#ef4444', color: 'white' },
        outline: { background: 'transparent', border: '2px solid var(--primary-main)', color: 'var(--primary-main)' }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
            style={{
                ...variants[variant],
                borderRadius: '16px',
                padding: '14px 28px',
                ...style
            }}
            {...rest}
        >
            {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full" role="status" />
            ) : null}
            {children}
        </button>
    );
};

export const Panel = ({ children, className = '', style = {} }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`transition-all duration-300 ${className}`}
        style={{
            background: 'var(--bg-card)',
            borderRadius: '32px',
            padding: '32px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            ...style
        }}
    >
        {children}
    </div>
);
