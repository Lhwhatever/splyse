const tickOptions = [5000, 10000, 12000, 15000, 20000, 30000, 40000, 60000, 80000, 90000, 100000];

const getNumOfTicks = (lo: number, hi: number, tickSize: number): [number, number] => {
    const canShiftByHalf = tickSize % 2000 == 0;

    const l = lo / tickSize;
    const h = hi / tickSize;

    const loInd = Math.floor(l) + (canShiftByHalf && l % 1 > 0.5 ? 0.5 : 0);
    const hiInd = Math.ceil(h) - (canShiftByHalf && h % 1 > 0 && h % 1 < 0.5 ? 0.5 : 0);

    return [loInd, Math.ceil(hiInd - loInd + 1)];
};

const createTickArray = (loInd: number, tickCount: number, tickSize: number): number[] => {
    const tickArray = [];
    for (let i = 0; i < tickCount; ++i) {
        tickArray.push((i + loInd) * tickSize);
    }

    return tickArray;
};

export const getTicks = (lo: number, hi: number, numOfBuckets = 8): number[] => {
    for (const tickSize of tickOptions) {
        const [loInd, tickCount] = getNumOfTicks(lo, hi, tickSize);

        if (tickCount <= numOfBuckets) {
            return createTickArray(loInd, tickCount, tickSize);
        }
    }

    return createTickArray(...getNumOfTicks(lo, hi, 120000), 120000);
};

export const formatDuration = (ms: number): string => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${Math.floor(s % 60)
        .toString()
        .padStart(2, '0')}`;
};
