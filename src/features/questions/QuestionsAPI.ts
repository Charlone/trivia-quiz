import {handleFetchedData} from "../../utils/Utils";

export async function fetchQuestions(url: string): Promise<any> {
  return await handleFetchedData(url);
}
