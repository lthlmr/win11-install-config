// components/TweakCard.tsx
import { type FC, useState } from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tweak } from '../lib/supabase';

interface TweakCardProps {
    tweak: Tweak;
    isSelected: boolean;
    onSelect: (tweak: Tweak) => void;
}

const TweakCard: FC<TweakCardProps> = ({ tweak, isSelected, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-grow">
                        <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-200 mb-2">{tweak.name}</h3>
                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-md bg-gray-700 text-gray-300">
                                {tweak.category}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">{tweak.description}</p>
                    </div>
                    <div className="flex ml-4">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="px-3 py-2 mr-2 rounded-lg text-sm font-semibold transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600"
                            aria-label={isExpanded ? "Masquer les détails" : "Afficher les détails"}
                        >
                            {isExpanded ? (
                                <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            onClick={() => onSelect(tweak)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
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
            </div>

            {isExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-gray-700 bg-gray-750">
                    <div className="mt-4">
                        <h4 className="text-md font-medium text-gray-300 mb-2 flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2" />
                            Description détaillée
                        </h4>
                        <div className="text-gray-400 text-sm mb-4 whitespace-pre-line">
                            {tweak.long_description}
                        </div>

                        <h4 className="text-md font-medium text-gray-300 mb-2">Commande PowerShell</h4>
                        <div className="bg-gray-900 p-3 rounded-md text-gray-300 text-sm font-mono overflow-x-auto">
                            {tweak.command}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TweakCard;