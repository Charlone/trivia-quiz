import {handleFetchedData} from "../../utils/Utils";

export async function fetchCategories(): Promise<any> {
    const url: string = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${process.env.NEXT_PUBLIC_CATEGORY_API}`;

    if (url) {
        return await handleFetchedData(url);
    }
}

export async function fetchCategoriesGlobalCount(id: number): Promise<any> {
    const url: string | undefined = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${process.env.NEXT_PUBLIC_CATEGORY_COUNT_API}${id}`;

    if (url) {
        return await handleFetchedData(url);
    }
}
