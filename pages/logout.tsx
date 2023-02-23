import {useRouter} from "next/router";
import {useAppDispatch} from "../src/app/hooks";
import Loader from "../src/components/Loader";
import {resetPlay} from "../src/utils/Utils";
export default function Logout() {
  const {push} = useRouter();
  const dispatch = useAppDispatch();

  resetPlay(dispatch, true);
  push("/api/auth/logout");

  return <Loader text={"Loading"} />
}