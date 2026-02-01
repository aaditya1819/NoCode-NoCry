import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react'
import type { Project } from '../types';
import { iframeScript } from '../assets/assets';
import EditorPanel from './EditorPanel';

export interface ProjectPreviewRef {
    getCode: () => string | undefined;
}

interface ProjectPreviewProps {
    project: Project
    isGenerating: boolean
    device?: 'phone' | 'tablet' | 'desktop'
    showEditorPanel?: boolean // Made optional
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({
    project,
    isGenerating,
    device = 'desktop',
    showEditorPanel = true // Default value
}, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [selectedElement, setSelectedElement] = useState<any>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        getCode: () => {
            const doc = iframeRef.current?.contentDocument;
            if (!doc) return project.current_code; // Fallback to initial code if doc not available

            // Clone the document to avoid side-effects on the live preview
            const clone = doc.documentElement.cloneNode(true) as HTMLElement;

            // 1. Remove our selection classes and outline from the clone
            clone.querySelectorAll('.ai-selected-element, [data-ai-selected]').forEach((el) => {
                el.classList.remove('ai-selected-element');
                el.removeAttribute('data-ai-selected');
                if ((el as HTMLElement).style) {
                    (el as HTMLElement).style.outline = '';
                }
            });

            // 2. Remove injected style and script from the clone
            const previewStyle = clone.querySelector('#ai-preview-style');
            if (previewStyle) previewStyle.remove();

            const previewScript = clone.querySelector('#ai-preview-script');
            if (previewScript) previewScript.remove();

            // 3. Serialize clean HTML
            return '<!DOCTYPE html>\n' + clone.outerHTML;
        }
    }));

    const resolution = {
        phone: 'w-[375px]', // Standard phone width
        tablet: 'w-[768px]', // Standard tablet width
        desktop: 'w-full'
    }

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'ELEMENT_SELECTED') {
                setSelectedElement(event.data.payload);
            } else if (event.data.type === 'CLEAR_SELECTION') {
                setSelectedElement(null);
            }
        }
        window.addEventListener('message', handleMessage)
        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])

    const handleUpdate = (updates: any) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_ELEMENT',
                payload: updates
            }, '*')
        }
    }

    const handleCloseEditor = () => {
        setSelectedElement(null);
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'CLEAR_SELECTION_REQUEST'
            }, '*');
        }
    }

    const injectPreview = (html: string) => {
        if (!html) {
            return '';
        }
        if (!showEditorPanel) {
            return html;
        }
        if (html.includes('</body>')) {
            return html.replace('</body>', iframeScript + '</body>');
        } else {
            return html + iframeScript;
        }
    }

    // Determine what to show
    const renderContent = () => {
        if (project.current_code) {
            return (
                <>
                    <iframe
                        ref={iframeRef}
                        srcDoc={injectPreview(project.current_code)}
                        className={`h-full ${resolution[device]} mx-auto transition-all duration-300 bg-white`}
                        title={`${project.name} preview`}
                    />
                    {showEditorPanel && selectedElement && (
                        <EditorPanel
                            selectedElement={selectedElement}
                            onUpdate={handleUpdate}
                            onClose={handleCloseEditor}
                        />
                    )}
                </>
            );
        } else if (isGenerating) {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                        <p className="text-gray-400">Generating website...</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-400 mb-2">No website generated yet</p>
                        <p className="text-gray-600 text-sm">Start a conversation to create your website</p>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className='relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2'>
            {renderContent()}
        </div>
    )
})

// Add display name for better debugging
ProjectPreview.displayName = 'ProjectPreview';

export default ProjectPreview