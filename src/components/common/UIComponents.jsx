import React from 'react';
import { motion } from 'framer-motion';

export const PageHeader = ({ title, subtitle, action }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const Card = ({ children, className = '', hover = false }) => (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>
        {children}
    </div>
);

export const Button = ({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    disabled = false,
    className = ''
}) => (
    <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={`btn btn-${variant} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
    </motion.button>
);

export const IconButton = ({
    children,
    variant = 'primary',
    onClick,
    className = ''
}) => (
    <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`icon-btn icon-btn-${variant} ${className}`}
    >
        {children}
    </motion.button>
);

export const Badge = ({
    children,
    variant = 'neutral',
    className = ''
}) => (
    <span className={`badge badge-${variant} ${className}`}>
        {children}
    </span>
);

export const SearchBar = ({
    value,
    onChange,
    placeholder = 'Buscar...',
    icon: Icon
}) => (
    <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3.5 text-slate-400" size={20} />}
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`input ${Icon ? 'pl-10' : ''}`}
        />
    </div>
);

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    closeIcon: CloseIcon
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="modal-content"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
                    {CloseIcon && (
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            <CloseIcon size={20} />
                        </button>
                    )}
                </div>
                {children}
            </motion.div>
        </motion.div>
    );
};

export const StatCard = ({
    icon: Icon,
    title,
    value,
    trend,
    color = 'bg-blue-500'
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="stat-card"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full -mr-16 -mt-16`} />
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</h3>
                {trend && (
                    <div className="flex items-center space-x-1 text-green-600">
                        <span className="text-xs font-medium">{trend}</span>
                    </div>
                )}
            </div>
            <div className={`stat-card-icon ${color}`}>
                <Icon className="text-white" size={24} />
            </div>
        </div>
    </motion.div>
);

export const EmptyState = ({
    icon: Icon,
    message,
    className = ''
}) => (
    <div className={`card p-12 text-center ${className}`}>
        <Icon className="mx-auto mb-4 text-slate-400" size={48} />
        <p className="text-slate-500 dark:text-slate-400 text-lg">{message}</p>
    </div>
);
