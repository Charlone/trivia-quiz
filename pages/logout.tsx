import {useRouter} from "next/router";
import {useAppDispatch} from "../src/app/hooks";
import Loader from "../src/components/Loader";
import {resetPlay} from "../src/utils/Utils";
import {setInitialUrl} from "../src/features/url/UrlSlice";
export default function Logout() {
  const {push} = useRouter();
  const dispatch = useAppDispatch();

  dispatch(setInitialUrl());
  resetPlay(dispatch, true);
  push("/api/auth/logout");

  return <Loader text={"Loading"} />
}