import {handleFetchedData} from "../../utils/Utils";

export async function fetchSession() {
  const url: string = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${process.env.NEXT_PUBLIC_SESSION_API}`;

  if (url) {
    return await handleFetchedData(url);
  }
}
