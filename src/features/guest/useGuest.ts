import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectGuest, setGuest} from "../guest/GuestSlice";
import {useEffect} from "react";
import {useUser} from "@auth0/nextjs-auth0/client";

export default function useGuest() {
    const { user } = useUser();
    const username = useAppSelector(selectGuest);
    const dispatch = useAppDispatch();

    function generateGuest() {
        const newGuest = {
            username: `guest_${Date.now()}`
        }

        dispatch(setGuest(newGuest));
    }

    useEffect(() => {
        if (username === '' && !user) {
            generateGuest();
        }

        return () => {}
    }, [username]);

    return {username};
}