import { type FC, useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { CheckIcon, QuestionMarkCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { useLoadData } from '../hooks/useLoadData';
import { Application, Optimization } from '../lib/supabase';
import { useUrlState } from '../hooks/useUrlState';

// Components Types
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

interface AppCardProps {
    app: Application;
    selectedApps: Application[];
    onSelect: (app: Application) => void;
    onDescriptionClick: (app: Application) => void;
}

interface OptimizationCardProps {
    optimization: Optimization;
    isSelected: boolean;
    onSelect: (optimization: Optimization) => void;
}

type TabType = 'applications' | 'optimizations';

// Reusable Components
const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => (
    <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Rechercher une application..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
    </div>
);

const TabButton: FC<TabButtonProps> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-lg transition-colors ${
            active
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);

const AppCard: FC<AppCardProps> = ({ app, selectedApps, onSelect, onDescriptionClick }) => {
    const isOptionSelected = useCallback((downloadUrl: string): boolean => {
        return selectedApps.some(selectedApp =>
            selectedApp.id === app.id && selectedApp.download_url === downloadUrl
        );
    }, [app.id, selectedApps]);

    return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center mb-3">
                <img
                    src={app.image_url}
                    alt={app.name}
                    className="w-12 h-12 object-contain mr-3 bg-gray-700 rounded-lg p-1"
                />
                <div className="flex-grow">
                    <h3 className="text-gray-200 font-medium">{app.name}</h3>
                    <p className="text-sm text-gray-400">{app.category}</p>
                </div>
                <button
                    onClick={() => onDescriptionClick(app)}
                    className="text-gray-400 hover:text-gray-200 transition-colors ml-2"
                    aria-label="Voir la description"
                >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
            </div>

            <p className="text-sm text-gray-400 mb-3">{app.description}</p>

            {app.options && app.options.length > 0 ? (
                <div className="space-y-2 mt-4">
                    {app.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                            <span className="text-gray-200 text-sm font-medium">{option.name}</span>
                            <button
                                onClick={() => onSelect({
                                    ...app,
                                    download_url: option.download_url,
                                    install_args: option.install_args
                                })}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                    isOptionSelected(option.download_url)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                }`}
                            >
                                {isOptionSelected(option.download_url) ? (
                                    <>
                                        <CheckIcon className="h-4 w-4 mr-1 inline-block" />
                                        Sélectionné
                                    </>
                                ) : (
                                    'Sélectionner'
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <button
                    onClick={() => onSelect(app)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isOptionSelected(app.download_url)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {isOptionSelected(app.download_url) ? (
                        <>
                            <CheckIcon className="h-4 w-4 mr-1 inline-block" />
                            Sélectionné
                        </>
                    ) : (
                        'Sélectionner'
                    )}
                </button>
            )}
        </div>
    );
};

const OptimizationCard: FC<OptimizationCardProps> = ({ optimization, isSelected, onSelect }) => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
        <div className="flex items-center justify-between">
            <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-200 mb-2">{optimization.name}</h3>
                <p className="text-gray-400 text-sm">{optimization.description}</p>
            </div>
            <button
                onClick={() => onSelect(optimization)}
                className={`ml-4 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
                {isSelected ? (
                    <span className="flex items-center">
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Sélectionné
                    </span>
                ) : (
                    'Sélectionner'
                )}
            </button>
        </div>
    </div>
);

// Main Component
const Home: FC = () => {
    const { applications, optimizations, loading, error } = useLoadData();
    const [selectedApps, setSelectedApps] = useState<Application[]>([]);
    const [selectedOptimizations, setSelectedOptimizations] = useState<Optimization[]>([]);
    const [generatedScript, setGeneratedScript] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedAppForDescription, setSelectedAppForDescription] = useState<Application | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('applications');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useUrlState(
        selectedApps,
        setSelectedApps,
        selectedOptimizations.map(opt => opt.id),
        (optIds: string[]) => setSelectedOptimizations(
            optimizations.filter(opt => optIds.includes(opt.id))
        ),
        applications,
        optimizations
    );

    const categorizedApps = useMemo(() => {
        const categories = Array.from(new Set(applications.map(app => app.category)));
        return categories.map(category => ({
            category,
            apps: applications.filter(app => app.category === category)
        }));
    }, [applications]);

    const filteredApps = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return categorizedApps.map(({ category, apps }) => ({
            category,
            apps: apps.filter(app =>
                app.name.toLowerCase().includes(searchLower) ||
                app.description.toLowerCase().includes(searchLower)
            )
        })).filter(({ apps }) => apps.length > 0);
    }, [categorizedApps, searchTerm]);

    const toggleAppSelection = useCallback((app: Application): void => {
        setSelectedApps(prevApps => {
            const isAlreadySelected = prevApps.some(a =>
                a.id === app.id && a.download_url === app.download_url
            );

            if (isAlreadySelected) {
                return prevApps.filter(a =>
                    !(a.id === app.id && a.download_url === app.download_url)
                );
            }

            if (app.options && app.options.length > 0) {
                return [...prevApps.filter(a => a.id !== app.id), app];
            }
            return [...prevApps, app];
        });
    }, []);

    const toggleOptimizationSelection = useCallback((optimization: Optimization): void => {
        setSelectedOptimizations(prevOpts => {
            const isAlreadySelected = prevOpts.some(opt => opt.id === optimization.id);
            if (isAlreadySelected) {
                return prevOpts.filter(opt => opt.id !== optimization.id);
            }
            return [...prevOpts, optimization];
        });
    }, []);

    const generatePowerShellScript = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch('/api/generate-script', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedApps,
                    selectedOptimizations
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate script');
            }

            const data = await response.json() as { script: string };
            setGeneratedScript(data.script);
        } catch (error) {
            console.error('Error generating script:', error);
        }
    }, [selectedApps, selectedOptimizations]);

    const copyToClipboard = useCallback(async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(generatedScript);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    }, [generatedScript]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg">Chargement des données...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-bold text-red-500 mb-4">Erreur</h2>
                    <p className="text-gray-300">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Générateur de Script d'Installation Windows</title>
                <meta name="description" content="Générer des scripts PowerShell pour installer des applications" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen bg-gray-900 text-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-100 mb-6">
                        Générateur de Script d'Installation Windows
                    </h1>

                    <div className="flex gap-4 mb-6">
                        <TabButton
                            active={activeTab === 'applications'}
                            onClick={() => setActiveTab('applications')}
                        >
                            Applications
                        </TabButton>
                        <TabButton
                            active={activeTab === 'optimizations'}
                            onClick={() => setActiveTab('optimizations')}
                        >
                            Optimisations Windows
                        </TabButton>
                    </div>

                    {activeTab === 'applications' && (
                        <>
                            <SearchBar value={searchTerm} onChange={setSearchTerm} />
                            <div className="space-y-8">
                                {filteredApps.map(({ category, apps }) => (
                                    <div key={category} className="space-y-4">
                                        <h2 className="text-xl font-semibold text-gray-200 mb-4">{category}</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {apps.map((app) => (
                                                <AppCard
                                                    key={app.id}
                                                    app={app}
                                                    selectedApps={selectedApps}
                                                    onSelect={toggleAppSelection}
                                                    onDescriptionClick={(app) => {
                                                        setSelectedAppForDescription(app);
                                                        setIsModalOpen(true);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'optimizations' && (
                        <div className="space-y-4">
                            {optimizations.map((optimization) => (
                                <OptimizationCard
                                    key={optimization.id}
                                    optimization={optimization}
                                    isSelected={selectedOptimizations.some((opt) => opt.id === optimization.id)}
                                    onSelect={toggleOptimizationSelection}
                                />
                            ))}
                        </div>
                    )}

                    {(selectedApps.length > 0 || selectedOptimizations.length > 0) && (
                        <div className="mt-8 border-t border-gray-700 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-200">
                                    Sélections ({selectedApps.length + selectedOptimizations.length})
                                </h2>
                                <button
                                    onClick={generatePowerShellScript}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg
                                             transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                                             focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    Générer le Script PowerShell
                                </button>
                            </div>

                            {selectedApps.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-300 mb-3">
                                        Applications Sélectionnées
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {selectedApps.map((app) => (
                                            <div
                                                key={`${app.id}-${app.download_url}`}
                                                className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <img
                                                        src={app.image_url}
                                                        alt={app.name}
                                                        className="w-8 h-8 object-contain mr-3 bg-gray-700 rounded p-1"
                                                    />
                                                    <div>
                                                        <span className="text-gray-200 block">{app.name}</span>
                                                        {app.options && app.options.length > 0 && (
                                                            <span className="text-gray-400 text-sm">
                                                                {app.options.find(opt => opt.download_url === app.download_url)?.name || 'Version standard'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleAppSelection(app)}
                                                    className="text-gray-400 hover:text-gray-200 transition-colors"
                                                    aria-label="Retirer de la sélection"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedOptimizations.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-300 mb-3">
                                        Optimisations Sélectionnées
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedOptimizations.map((opt) => (
                                            <div
                                                key={opt.id}
                                                className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700"
                                            >
                                                <span className="text-gray-200">{opt.name}</span>
                                                <button
                                                    onClick={() => toggleOptimizationSelection(opt)}
                                                    className="text-gray-400 hover:text-gray-200 transition-colors"
                                                    aria-label="Retirer de la sélection"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {generatedScript && (
                        <div className="mt-8 border-t border-gray-700 pt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-200">
                                    Script PowerShell Généré
                                </h2>
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg
                                             transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Copier dans le Presse-papiers
                                </button>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                    {generatedScript}
                                </pre>
                            </div>
                        </div>
                    )}

                    <Dialog
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        className="relative z-50"
                    >
                        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-gray-800 p-6 shadow-xl">
                                {selectedAppForDescription && (
                                    <>
                                        <Dialog.Title className="text-lg font-medium leading-6 text-gray-100">
                                            {selectedAppForDescription.name} - Description
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-300">
                                                {selectedAppForDescription.description}
                                            </p>
                                        </div>
                                    </>
                                )}
                                <button
                                    type="button"
                                    className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600
                                             transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Fermer
                                </button>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                </div>
            </main>
        </>
    );
};

export default Home;