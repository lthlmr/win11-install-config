// components/AppCard.tsx
import { type FC, useCallback } from 'react';
import { CheckIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Application } from '../lib/supabase';

interface AppCardProps {
    app: Application;
    selectedApps: Application[];
    onSelect: (app: Application) => void;
    onDescriptionClick: (app: Application) => void;
}

const AppCard: FC<AppCardProps> = ({ app, selectedApps, onSelect, onDescriptionClick }) => {
    const isOptionSelected = useCallback((downloadUrl: string): boolean => {
        return selectedApps.some(selectedApp =>
            selectedApp.id === app.id && selectedApp.download_url === downloadUrl
        );
    }, [app.id, selectedApps]);

    // Determine if this is a Java application which needs special handling
    const isJavaApp = app.id === 'java';

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
                    {/* If it's Java, show a header for versions */}
                    {isJavaApp && (
                        <h4 className="text-gray-300 text-sm font-semibold mb-1">Versions disponibles:</h4>
                    )}
                    {app.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                            <span className="text-gray-200 text-sm font-medium">
                                {option.name}
                                {isJavaApp && option.name.includes("LTS") && (
                                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded-md">LTS</span>
                                )}
                            </span>
                            <button
                                onClick={() => {
                                    // For Java applications, we need to properly extract the version
                                    if (isJavaApp) {
                                        // Extract the version from the name (e.g., "Java 21.0.2 (LTS)" -> "21.0.2")
                                        const versionMatch = option.name.match(/(\d+\.\d+\.\d+)/);
                                        const version = versionMatch ? versionMatch[1] : option.install_args;

                                        onSelect({
                                            ...app,
                                            download_url: option.download_url,
                                            install_args: option.install_args,
                                            version: version // Explicitly set version
                                        });
                                    } else {
                                        onSelect({
                                            ...app,
                                            download_url: option.download_url,
                                            install_args: option.install_args
                                        });
                                    }
                                }}
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

export default AppCard;