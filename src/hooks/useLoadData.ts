// hooks/useLoadData.ts
import { useState, useEffect } from 'react';
import {supabase, Application, ApplicationOption, Optimization, Tweak} from '../lib/supabase';

export const useLoadData = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [optimizations, setOptimizations] = useState<Optimization[]>([]);
    const [tweaks, setTweaks] = useState<Tweak[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load applications
                const { data: apps, error: appsError } = await supabase
                    .from('applications')
                    .select('*');

                if (appsError) throw appsError;

                // Load application options
                const { data: options, error: optionsError } = await supabase
                    .from('application_options')
                    .select('*');

                if (optionsError) throw optionsError;

                // Load optimizations
                const { data: opts, error: optsError } = await supabase
                    .from('optimizations')
                    .select('*');

                if (optsError) throw optsError;

                // Load tweaks
                const { data: twks, error: twksError } = await supabase
                    .from('tweaks')
                    .select('*');

                if (twksError) throw twksError;

                // Combine applications with their options
                const appsWithOptions = apps.map(app => ({
                    ...app,
                    options: options
                        .filter(opt => opt.application_id === app.id)
                        .map(opt => ({
                            id: opt.id,
                            name: opt.name,
                            application_id: opt.application_id,
                            download_url: opt.download_url,
                            install_args: opt.install_args
                        })) as ApplicationOption[]
                }));

                setApplications(appsWithOptions);
                setOptimizations(opts);
                setTweaks(twks || []);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while loading data');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { applications, optimizations, tweaks, loading, error };
};