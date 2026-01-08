/**
 * Get the user's local date string in YYYY-MM-DD format.
 * This avoids the issue where converting to ISO string (UTC) might return
 * the previous or next day depending on the user's timezone.
 */
export function getUserLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Format a date string for display (e.g., "7 ene 2026")
 */
export function formatDateDisplay(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date treating input as local time (using constructor with arguments)
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
