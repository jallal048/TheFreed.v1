import React, { useState } from 'react';
import { useData } from '../../contexts/DataProvider';
import { Announcement } from '../../types';
import { Icon } from '../../components/Icon';
import { formatTimestamp } from '../../utils/formatters';

const AnnouncementForm: React.FC<{
    announcement?: Announcement;
    onSave: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
}> = ({ announcement, onSave, onCancel }) => {
    const [title, setTitle] = useState(announcement?.title || '');
    const [content, setContent] = useState(announcement?.content || '');
    const [target, setTarget] = useState<'all' | 'CREATOR' | 'FAN'>(announcement?.target || 'all');
    const [isActive, setIsActive] = useState(announcement?.isActive ?? true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content, target, isActive });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-700 space-y-4">
            <h2 className="text-2xl font-semibold text-white">{announcement ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={3} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" />
            </div>
            <div className="flex flex-wrap gap-4">
                <div>
                    <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
                    <select id="target" value={target} onChange={e => setTarget(e.target.value as any)} className="bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white">
                        <option value="all">All Users</option>
                        <option value="CREATOR">Creators Only</option>
                        <option value="FAN">Fans Only</option>
                    </select>
                </div>
                <div className="flex items-end pb-1">
                     <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-600" />
                        Active
                    </label>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-full">Save Announcement</button>
            </div>
        </form>
    );
};

export const AdminAnnouncementsPage: React.FC = () => {
    const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useData();
    const [isCreating, setIsCreating] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    
    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleSave = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
        if (editingAnnouncement) {
            updateAnnouncement(editingAnnouncement.id, data);
        } else {
            createAnnouncement(data);
        }
        setIsCreating(false);
        setEditingAnnouncement(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                    <Icon name="bell" className="w-9 h-9 text-indigo-400" />
                    Announcements
                </h1>
                <button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-full flex items-center gap-2">
                    <Icon name="plus" className="w-5 h-5" /> New Announcement
                </button>
            </div>
            
            {(isCreating || editingAnnouncement) && (
                <div className="mb-8">
                    <AnnouncementForm
                        announcement={editingAnnouncement || undefined}
                        onSave={handleSave}
                        onCancel={() => { setIsCreating(false); setEditingAnnouncement(null); }}
                    />
                </div>
            )}
            
            <div className="space-y-4">
                {sortedAnnouncements.map(ann => (
                    <div key={ann.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-start">
                             <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-white">{ann.title}</h3>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ann.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                        {ann.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">Target: {ann.target.charAt(0).toUpperCase() + ann.target.slice(1)} · Created: {formatTimestamp(ann.createdAt)}</p>
                                <p className="mt-2 text-gray-300">{ann.content}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingAnnouncement(ann)} className="p-2 text-gray-400 hover:text-indigo-400 rounded-md hover:bg-gray-800"><Icon name="pencil" className="w-5 h-5"/></button>
                                <button onClick={() => deleteAnnouncement(ann.id)} className="p-2 text-gray-400 hover:text-red-400 rounded-md hover:bg-gray-800"><Icon name="trash" className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
