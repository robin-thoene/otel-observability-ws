'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

interface IProps<T> {
    /** Array of items to search through. */
    items: T[];
    /** The key in the item to filter for, if not using labelExtractor */
    searchKey?: keyof T;
    /** Function to get the label of each item, if not using searchKey */
    labelExtractor?: (item: T) => string;
    /** Function called when an item is added. */
    onItemSelect: (item: T) => void;
    /** Placeholder text. */
    placeholder?: string;
}

/**
 * Search input that filters items based on the search term.
 */
export function DataSearch<T>(props: IProps<T>) {
    /** The selected item. */
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    /** The search term. */
    const [searchTerm, setSearchTerm] = useState('');

    /** Helper to get the label for each item based on the provided key or extractor function */
    const getLabel = (item: T): string => {
        if (props.labelExtractor) return props.labelExtractor(item);
        if (props.searchKey) return String(item[props.searchKey]);
        throw new Error("Either 'labelExtractor' or 'searchKey' must be provided.");
    };

    /** Filter items based on the search term. */
    const filteredItems = props.items.filter((item) => getLabel(item).toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="flex gap-4">
                <input
                    type="text"
                    className="w-full p-2 border border-white rounded-md focus:outline-none focus:border-gray-500"
                    placeholder={props.placeholder}
                    value={selectedItem ? getLabel(selectedItem) : searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedItem(null);
                    }}
                />
                <button
                    onClick={() => {
                        if (selectedItem) {
                            props.onItemSelect(selectedItem);
                            setSearchTerm('');
                            setSelectedItem(null);
                        }
                    }}
                    className="flex justify-center items-center text-black bg-gray-200 rounded-md hover:bg-gray-500 transition-colors duration-150"
                >
                    <PlusIcon className="size-6" />
                </button>
            </div>
            {searchTerm && !selectedItem && (
                <ul className="border border-white rounded-md max-h-48 overflow-y-auto">
                    {filteredItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => setSelectedItem(item)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-600 hover:text-white transition-colors duration-150"
                        >
                            {getLabel(item)}
                        </li>
                    ))}
                    {filteredItems.length === 0 && <li className="px-4 py-2 text-gray-500">No results found</li>}
                </ul>
            )}
        </div>
    );
}
