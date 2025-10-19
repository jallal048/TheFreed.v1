import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { Icon } from '../components/Icon';
import { SupportTicketCategory } from '../types';
import { useNavigation } from '../contexts/NavigationProvider';

export const SupportPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { createSupportTicket } = useData();
    const { onGoToHome } = useNavigation();

    const [email, setEmail] = useState('');
    const [category, setCategory] = useState<SupportTicketCategory>('GENERAL');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await createSupportTicket({
            email: currentUser ? undefined : email,
            category,
            subject,
            message
        });
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto text-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <Icon name="check-circle" className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ticket Submitted!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Thank you for contacting support. We have received your ticket and will get back to you as soon as possible.
                </p>
                <button onClick={onGoToHome} className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Support Center</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">How can we help you today?</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl space-y-6 border border-gray-200 dark:border-gray-800">
                {!currentUser && (
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email Address</label>
                        <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" />
                    </div>
                )}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as SupportTicketCategory)} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                        <option value="GENERAL">General Inquiry</option>
                        <option value="ACCOUNT">Account Issue</option>
                        <option value="BILLING">Billing Problem</option>
                        <option value="TECHNICAL">Technical Issue</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                    <input type="text" name="subject" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required placeholder="A brief summary of your issue" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                    <textarea name="message" id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={6} placeholder="Please describe your issue in detail..." className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 resize-y" />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
};