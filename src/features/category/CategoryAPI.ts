import {handleFetchedData} from "../../utils/Utils";

export async function fetchCategories() {
    const url: string = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${process.env.NEXT_PUBLIC_CATEGORY_API}`;

    if (url) {
        return await handleFetchedData(url);
    }
}

export async function fetchCategoriesGlobalCount() {
    const url: string | undefined = process.env.NEXT_PUBLIC_GLOBAL_COUNT;

    if (url) {
        return await handleFetchedData(url);
    }
}
