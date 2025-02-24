// hooks/useUrlState.tsx
import { useEffect, useCallback, useRef } from 'react';
import { Application, Optimization } from '../lib/supabase';

interface UrlState {
    apps: Application[];
    optimizations: string[];
}

// Fonction utilitaire pour encoder en base64 de manière sûre
const safeBase64Encode = (str: string): string => {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        console.error('Error encoding to base64:', e);
        return '';
    }
};

// Fonction utilitaire pour décoder du base64 de manière sûre
const safeBase64Decode = (str: string): string => {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        console.error('Error decoding from base64:', e);
        return '';
    }
};

export const useUrlState = (
    selectedApps: Application[],
    setSelectedApps: (apps: Application[]) => void,
    selectedOptimizations: string[],
    setSelectedOptimizations: (optimizations: string[]) => void,
    apps: Application[],
    optimizations: Optimization[],
    isLoading: boolean
) => {
    const hasInitialized = useRef(false);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Encodage de l'état
    const encodeState = useCallback((state: UrlState): string => {
        const jsonState = JSON.stringify(state);
        return safeBase64Encode(jsonState);
    }, []);

    // Décodage de l'état
    const decodeState = useCallback((encoded: string): UrlState | null => {
        try {
            const jsonState = safeBase64Decode(encoded);
            return JSON.parse(jsonState);
        } catch (error) {
            console.error('Error decoding state:', error);
            return null;
        }
    }, []);

    // Mise à jour de l'URL
    const updateUrl = useCallback(() => {
        if (typeof window === 'undefined') return;

        const state: UrlState = {
            apps: selectedApps,
            optimizations: selectedOptimizations
        };

        const encoded = encodeState(state);
        if (!encoded) return;

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('state', encoded);
        window.history.replaceState({}, '', newUrl.toString());
    }, [selectedApps, selectedOptimizations, encodeState]);

    // Validation des applications sélectionnées
    const validateSelectedApps = useCallback((decodedApps: Application[]): Application[] => {
        return decodedApps.filter(decodedApp => {
            const validApp = apps.find(app => app.id === decodedApp.id);
            if (!validApp) return false;

            // Vérifier si c'est une option valide
            if (validApp.options && validApp.options.length > 0) {
                return validApp.options.some(opt => opt.download_url === decodedApp.download_url);
            }

            // Si pas d'options, vérifier l'URL de téléchargement par défaut
            return validApp.download_url === decodedApp.download_url;
        });
    }, [apps]);

    // Validation des optimisations sélectionnées
    const validateSelectedOptimizations = useCallback((decodedOptIds: string[]): string[] => {
        return decodedOptIds.filter(optId =>
            optimizations.some(opt => opt.id === optId)
        );
    }, [optimizations]);

    // Chargement initial depuis l'URL
    useEffect(() => {
        if (hasInitialized.current || isLoading) return;

        // Attendre que les données soient chargées
        if (apps.length === 0 || optimizations.length === 0) return;

        const urlParams = new URLSearchParams(window.location.search);
        const stateParam = urlParams.get('state');

        if (stateParam) {
            const decodedState = decodeState(stateParam);
            if (decodedState) {
                const validApps = validateSelectedApps(decodedState.apps);
                const validOptimizations = validateSelectedOptimizations(decodedState.optimizations);

                if (validApps.length > 0) {
                    setSelectedApps(validApps);
                }
                if (validOptimizations.length > 0) {
                    setSelectedOptimizations(validOptimizations);
                }
            }
        }

        hasInitialized.current = true;
    }, [apps, optimizations, isLoading, decodeState, setSelectedApps, setSelectedOptimizations, validateSelectedApps, validateSelectedOptimizations]);

    // Mise à jour de l'URL lors des changements d'état
    useEffect(() => {
        if (!hasInitialized.current) return;

        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
            updateUrl();
        }, 500);

        return () => {
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [selectedApps, selectedOptimizations, updateUrl]);

    return {
        updateUrl,
        encodeState,
        decodeState
    };
};