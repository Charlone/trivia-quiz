import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { fetchSession } from "./SessionAPI";
import { selectSession, setToken } from "./SessionSlice";

export default function useSession(command: string | undefined = undefined) {
  const {token, response_code, response_message} = useAppSelector(selectSession);
  const dispatch = useAppDispatch();
  const [loadingSession, setLoadingSession] = useState<boolean>(false);

  const generateToken = () => {
    setLoadingSession(true);
    fetchSession().then(data => dispatch(setToken(data)));
    setTimeout(() => setLoadingSession(false), 500);
  }

  const handleSession = (command: string | undefined) => {
    switch (command) {
      case "reset":
        generateToken();
        break;
      default:
        if (!token.length && !loadingSession) {
          generateToken();
        };
        break;
    }
  }

  useEffect(() => {
    handleSession(command);

    return () => {}
  }, [token]);

  return {token, response_code, response_message};
}
