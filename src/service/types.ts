export type Feature = {
    featureName: string;
    featureUsedCount: number;
};

export type Row = {
    id: number;
    [key: string]: number | string;
}