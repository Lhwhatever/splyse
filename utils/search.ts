/* eslint-disable @typescript-eslint/ban-types */
import FuzzySearch from 'fuzzy-search';

/**
 * Performs a fuzzy search on the given array. If the search string is
 * '', returns the given array. The array is automatically sorted in
 * descending order of relevance.
 *
 * @param arr The array to search.
 * @param searchString The string to search for. If empty, the original array is returned.
 * @param keysToSearch Keys to search.
 */
const search = <T extends object | string>(arr: T[], searchString: string, keysToSearch: string[]): T[] => {
    if (searchString === '') return arr;

    const searcher = new FuzzySearch(arr, keysToSearch, {
        sort: true,
    });
    return searcher.search(searchString);
};

export default search;
