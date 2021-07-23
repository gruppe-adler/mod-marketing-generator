export interface Values {
    fullName: string;
    gitHubRepo: string;
    description: string;
    authors: string[];
    uploadedAdler: Blob|null;
    mainMenuLogo: {
        text: string;
        fontSize: number;
    }
}
