/**
 * Persistence utilities for memorial state
 * The land never fully heals - damage persists across visits
 */

const STORAGE_KEY = 'geography-of-absence';

// Get stored state
export function getStoredState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Could not read localStorage:', e);
    }
    return null;
}

// Save state
export function saveState(state) {
    try {
        const existing = getStoredState() || {};
        const merged = {
            ...existing,
            ...state,
            visitCount: (existing.visitCount || 0) + (state.firstVisit ? 1 : 0),
            lastVisit: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
        console.warn('Could not write to localStorage:', e);
    }
}

// Initialize visit tracking
export function initVisit() {
    const state = getStoredState();
    if (!state) {
        // First visit
        saveState({
            firstVisit: true,
            visitCount: 1,
            craterRevealProgress: 0,
            viewedCities: [],
            soundEnabled: false
        });
        return { isFirstVisit: true, visitCount: 1 };
    }

    // Returning visitor
    saveState({ firstVisit: false });
    return {
        isFirstVisit: false,
        visitCount: state.visitCount || 1,
        craterRevealProgress: state.craterRevealProgress || 0,
        viewedCities: state.viewedCities || []
    };
}

// Mark a city as viewed
export function markCityViewed(cityId) {
    const state = getStoredState() || {};
    const viewedCities = state.viewedCities || [];
    if (!viewedCities.includes(cityId)) {
        viewedCities.push(cityId);
        saveState({ viewedCities });
    }
}

// Update crater reveal progress (0-1)
export function updateCraterProgress(progress) {
    saveState({ craterRevealProgress: Math.min(1, progress) });
}

// Get sound preference
export function getSoundEnabled() {
    const state = getStoredState();
    return state?.soundEnabled ?? false;
}

// Set sound preference
export function setSoundEnabled(enabled) {
    saveState({ soundEnabled: enabled });
}
