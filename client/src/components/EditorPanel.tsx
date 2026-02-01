import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}

export const EditorPanel = ({ selectedElement, onUpdate, onClose }: EditorPanelProps) => {
    const [values, setValues] = useState(selectedElement)

    useEffect(() => {
        setValues(selectedElement)
    }, [selectedElement])

    if (!selectedElement || !values) {
        return null
    }

    const handleChange = (field: string, value: string) => {
        const newValues = { ...values, [field]: value }
        setValues(newValues)
        onUpdate({ [field]: value })
    }

    const handleStyleChange = (styleName: string, value: string) => {
        const newStyles = { ...values.styles, [styleName]: value };
        const newValues = { ...values, styles: newStyles };
        setValues(newValues);
        onUpdate({ styles: { [styleName]: value } });
    }

    const handleBackgroundColorChange = (value: string) => {
        const newStyles = { ...values.styles, backgroundColor: value };
        const newValues = { ...values, styles: newStyles };
        setValues(newValues);
        onUpdate({ styles: { backgroundColor: value } });
    }

    const handleTextColorChange = (value: string) => {
        const newStyles = { ...values.styles, color: value };
        const newValues = { ...values, styles: newStyles };
        setValues(newValues);
        onUpdate({ styles: { color: value } });
    }

    const handleApplyChanges = () => {
        onUpdate({
            text: values.text,
            className: values.className,
            styles: values.styles
        });
        onClose();
    }

    return (
        <div className="fixed left-0 top-0 bottom-0 z-50 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col animate-fade-in fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
                <h3 className='text-xl font-semibold text-white'>Edit Element</h3>
                <button
                    onClick={onClose}
                    className='p-1.5 hover:bg-gray-800 rounded-md transition-colors'
                >
                    <X className='w-5 h-5 text-gray-400' />
                </button>
            </div>

            {/* Content - Scrollable */}
            <div className='flex-1 overflow-y-auto p-4 space-y-6'>
                {/* Text Content */}
                <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Text Content
                    </label>
                    <textarea
                        value={values.text}
                        onChange={(e) => handleChange('text', e.target.value)}
                        className="w-full bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-20 resize-none"
                        rows={3}
                    />
                </div>

                {/* Class Name */}
                <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Class Name
                    </label>
                    <input
                        type='text'
                        value={values.className || ''}
                        onChange={(e) => handleChange('className', e.target.value)}
                        className="w-full bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>

                {/* Padding & Margin Row */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Padding
                        </label>
                        <input
                            type='text'
                            value={values.styles.padding || '0px'}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                            className="w-full bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="e.g., 16px"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                            Margin
                        </label>
                        <input
                            type='text'
                            value={values.styles.margin || '0px 0px 16px'}
                            onChange={(e) => handleStyleChange('margin', e.target.value)}
                            className="w-full bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="e.g., 0px 0px 16px"
                        />
                    </div>
                </div>

                {/* Font Size */}
                <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Font Size
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type='text'
                            value={values.styles.fontSize || '60px'}
                            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                            className="flex-1 bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="e.g., 60px"
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleStyleChange('fontSize', '12px')}
                                className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md transition-colors"
                            >
                                S
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStyleChange('fontSize', '16px')}
                                className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md transition-colors"
                            >
                                M
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStyleChange('fontSize', '24px')}
                                className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md transition-colors"
                            >
                                L
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Color */}
                <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Background
                    </label>
                    <div className='flex items-center gap-3'>
                        <input
                            type='text'
                            value={values.styles.backgroundColor || 'rgba(0, 0, 0, 0)'}
                            onChange={(e) => handleBackgroundColorChange(e.target.value)}
                            className="flex-1 bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="e.g., rgba(0, 0, 0, 0)"
                        />
                        <input
                            type='color'
                            value={values.styles.backgroundColor?.startsWith('#') ? values.styles.backgroundColor : '#000000'}
                            onChange={(e) => handleBackgroundColorChange(e.target.value)}
                            className="w-10 h-10 cursor-pointer bg-transparent border-0 rounded"
                        />
                    </div>
                </div>

                {/* Text Color */}
                <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Text Color
                    </label>
                    <div className='flex items-center gap-3'>
                        <input
                            type='text'
                            value={values.styles.color || 'oklch(0.278 0.033 256.848)'}
                            onChange={(e) => handleTextColorChange(e.target.value)}
                            className="flex-1 bg-gray-800 text-white text-sm p-3 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="e.g., oklch(0.278 0.033 256.848)"
                        />
                        <input
                            type='color'
                            value={values.styles.color?.startsWith('#') ? values.styles.color : '#000000'}
                            onChange={(e) => handleTextColorChange(e.target.value)}
                            className="w-10 h-10 cursor-pointer bg-transparent border-0 rounded"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-4"></div>

                {/* Element Info */}
                <div className="space-y-3">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center gap-2 mb-2 px-3 py-1.5 bg-gray-800 rounded-md">
                            <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
                            <span className="text-sm text-gray-300">200 × 200</span>
                        </div>
                    </div>

                    {/* Tag Info */}
                    <div className="text-center text-sm text-gray-400">
                        <p>Tag: <span className="text-indigo-300 font-mono">{values.tagName}</span></p>
                    </div>

                    {/* Preview Text */}
                    <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500 text-center">Contact Information</p>
                        <div className="text-sm text-gray-400 space-y-1 bg-gray-800/50 p-3 rounded">
                            <p>Location</p>
                            <p className="text-gray-300">San Francisco, California</p>
                            <p className="mt-2">Email</p>
                            <p className="text-gray-300">hello@yourname.com</p>
                            <p className="mt-2">Phone</p>
                            <p className="text-gray-300">+1 (123) 456-7890</p>
                            <p className="mt-2">Follow Me</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApplyChanges}
                        className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditorPanel;