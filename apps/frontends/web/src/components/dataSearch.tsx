"use client";

import { useMemo, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

interface IProps<T> {
  /** Function to call when search term changes. */
  onSearch: (query: string) => void;
  /** The search results.*/
  searchResults: T[];
  /** The items that are already selected. */
  existingItems: T[];
  /** Function to get the label of each item. */
  labelExtractor: (item: T) => string;
  /** Placeholder text. */
  placeholder?: string;
  onSubmit: (item: T) => void;
}

/**
 * Search input that filters items based on the search term.
 */
export function DataSearch<T>(props: IProps<T>) {
  /** The selected item. */
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  /** The search term. */
  const [searchTerm, setSearchTerm] = useState("");

  /** Search for items when changing the search term.  */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    props.onSearch(query);
  };

  const filteredSearchRes = useMemo(
    () =>
      props.searchResults.filter(
        (item) =>
          !props.existingItems.some(
            (exItem) =>
              props.labelExtractor(item) === props.labelExtractor(exItem),
          ),
      ),
    [props],
  );

  return (
    <div className="flex gap-4">
      <div className="flex flex-col w-full">
        <input
          type="text"
          className="w-full p-2 border border-white rounded-md focus:outline-none focus:border-gray-500"
          placeholder={props.placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <ul className="border border-white rounded-md max-h-48 overflow-y-auto">
            {filteredSearchRes.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedItem(item);
                  setSearchTerm(
                    props.labelExtractor ? props.labelExtractor(item) : "",
                  );
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-600 hover:text-white transition-colors duration-150"
              >
                {props.labelExtractor ? props.labelExtractor(item) : ""}
              </li>
            ))}
            {filteredSearchRes.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
      <div className="items-start">
        <button
          disabled={!selectedItem}
          onClick={() => {
            if (selectedItem) {
              props.onSubmit(selectedItem);
              setSelectedItem(null);
              setSearchTerm("");
            }
          }}
          className="flex justify-center items-center text-black bg-gray-200 rounded-md hover:bg-gray-500 transition-colors duration-150 disabled:opacity-75 disabled:pointer-events-none"
        >
          <PlusIcon className="size-6" />
        </button>
      </div>
    </div>

    //
  );
}
