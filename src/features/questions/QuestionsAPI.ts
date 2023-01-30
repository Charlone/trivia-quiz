import {handleFetchedData} from "../../utils/Utils";
import {useAppSelector} from "../../app/hooks";
import {selectUrl} from "../url/UrlSlice";

export async function fetchQuestions(url: string): Promise<any> {
    return await handleFetchedData(url);
}
