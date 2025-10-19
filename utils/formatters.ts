export function formatTimestamp(isoString: string): string {
    if (!isoString) return '';
    if (isoString === 'Scheduled') return 'Scheduled';
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 5) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 2 * 86400) return 'Yesterday';
    return `${Math.floor(diffSeconds / 86400)}d ago`;
}

export function formatLastSeen(isoString: 'online' | string): string {
    if (isoString === 'online') return 'Active now';
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Active just now';
    if (diffSeconds < 3600) return `Active ${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `Active ${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 2 * 86400) return 'Active yesterday';
    return `Active ${Math.floor(diffSeconds / 86400)}d ago`;
}

export function formatConvoTimestamp(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (new Date(now.getTime() - 86400000).toDateString() === date.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
}

export const formatStat = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};
