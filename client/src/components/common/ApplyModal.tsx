"use client";

import { useState } from 'react';

import { Send } from 'lucide-react';

interface ApplyModalProps {
    show: boolean;
    onClose: () => void;
    onApply: (coverNote: string) => void;
    applying: boolean;
}

function ApplyModal({ show, onClose, onApply, applying }: ApplyModalProps) {
    const [coverNote, setCoverNote] = useState("");

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                    <h5 className="font-bold flex items-center" style={{ color: 'var(--text-main)' }}>
                        <Send className="mr-2" style={{ color: 'var(--primary-500)', width: '1.2rem', height: '1.2rem' }} />
                        Apply for this Job
                    </h5>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-red-500 transition-colors text-2xl font-bold leading-none" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                </div>
                <div className="px-6 py-4">
                    <label className="block mb-2" style={{ color: 'var(--text-main)' }}>
                        Cover Note (Optional)
                    </label>
                    <textarea
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        className="w-full premium-input"
                        rows={4}
                        placeholder="Introduce yourself briefly..."
                        maxLength={500}
                    />
                    <small style={{ color: 'var(--text-muted)' }}>{coverNote.length}/500</small>
                </div>
                <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-0">
                    <button onClick={onClose} className="rounded-full px-4 py-2"
                        style={{ background: 'var(--bg-surface)', color: 'var(--text-main)' }}>
                        Cancel
                    </button>
                    <button onClick={() => onApply(coverNote)} disabled={applying}
                        className="rounded-full px-4 py-2"
                        style={{ background: 'var(--primary-500)', color: 'white' }}>
                        {applying ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplyModal;
