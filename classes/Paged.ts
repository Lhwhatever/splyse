export interface SpotifyPage<E> {
    items: E[];
    total: number;
}

/**
 * This is a wrapper class to handle the paged objects emitted by Spotify's
 * API.
 *
 * @template E The type of the paged object.
 */
class Paged<E> {
    private constructor(
        public readonly length: number,
        private _buffer: E[],
        public readonly perPage: number,
        private _cumulative: number = 0,
        private _fetcher: (limit: number, offset: number) => Promise<SpotifyPage<E>>
    ) {}

    /**
     * Creates a promise of a Paged object, fetching the first page to
     * determine the total number of objects.
     *
     * This exists because constructors cannot be async, but an async action of
     * fetching the object is required to determine the total number of
     * objects. Hence, this acts as a wrapper around the private constructor.
     *
     * @template E The type of the paged object.
     * @param perPage The number of objects to fetch each time (i.e. each
     * page).
     * @param fetcher A function that actually performs the fetching.
     * @param beginAt An optional number to indicate the position (offset)
     * which to begin the first fetch.
     *
     * @returns A Promise of the Paged<E> object.
     */
    static async create<E>(
        perPage: number,
        fetcher: (limit: number, offset: number) => Promise<SpotifyPage<E>>,
        beginAt = 0
    ): Promise<Paged<E>> {
        const { items, total } = await fetcher(perPage, beginAt);
        return new Paged(total, items, perPage, beginAt, fetcher);
    }

    /**
     * The cumulative number of objects that have been fetched so far.
     */
    public get cumulative(): number {
        return this._cumulative;
    }

    /**
     * Checks whether there are more objects to fetch.
     * @returns true if there are, and vice versa.
     */
    public hasNext(): boolean {
        return this._buffer.length > 0 || this.cumulative < this.length;
    }

    /**
     * Fetch the next page of objects.
     *
     * @returns A Promise of an array containing all objects on the next page.
     * If there are no more objects to fetch, this would be an empty array. Any
     * errors during fetching cause the Promise to be rejected.
     */
    public async fetchNext(): Promise<E[]> {
        // empty arrays are truthy!!
        if (this._buffer.length) {
            const page = this._buffer;
            this._cumulative += page.length;
            this._buffer = [];
            return page;
        }

        if (this.cumulative >= this.length) return [];

        const page = (await this._fetcher(this.perPage, this.cumulative)).items;
        this._cumulative += page.length;
        return page;
    }

    /**
     * Fetch all remaining objects.
     *
     * @returns A Promise of an array containing all remaining objects. If
     * there are no more objects to fetch, this would be an empty array. Any
     * errors during fetching cause the Promise to be rejected.
     */
    public async fetchAll(): Promise<E[]> {
        let objects: E[] = [];

        while (this.hasNext()) {
            objects = objects.concat(await this.fetchNext());
        }

        return objects;
    }
}

export default Paged;
