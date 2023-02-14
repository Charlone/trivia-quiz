import {useEffect} from "react";
import Nav from 'react-bootstrap/Nav';
import Link from "next/link";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectPoints, setUserInitialPoints} from "../features/points/PointsSlice";
import {selectGuest} from "../features/guest/GuestSlice";
import {selectUser, unSetUser} from "../features/user/UserSlice";
import {generateGuest} from "../utils/Utils";
import userStockImage from "../images/user.png";
import styles from '../../styles/components/Header.module.scss';

export default function Header(): JSX.Element {
    const dispatch = useAppDispatch();
    const {push} = useRouter();
    const { user } = useAppSelector(selectUser);
    const username = useAppSelector(selectGuest);
    const { header, dflex, userpicture, userstockpicture, firsttile } = styles;
    const { initial_points, current_points } = useAppSelector(selectPoints);

    useEffect(() => {
        if (user.name) {
            if (user && user.name && current_points.length === 0 || user && user.name && !current_points.find(userPointsObject => userPointsObject.user === user.name)) {
                dispatch(setUserInitialPoints({user: user.name as string, points: initial_points}));
            }
        } else {
            if (username === '') {
                generateGuest(dispatch);
            }

            if (username !== '' && current_points.length === 0 || username !== '' && !current_points.find(userPointsObject => userPointsObject.user === username)) {
                dispatch(setUserInitialPoints({user: username, points: initial_points}));
            }
        }
    }, [user, username, current_points]);

    const handleLogoutClick = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(unSetUser());
        push('/api/auth/logout');
    }

    return (
        <Nav
            className={header}
            activeKey="/home"
            // onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
            <Nav.Item>
                {
                    user && user.picture && user.name
                        ? <div className={dflex}>
                            <img className={userpicture} src={user.picture} alt={user.name} />
                            <Link className={`${firsttile} nav-link text-white`} href={"profile"}>{user.name}</Link>
                        </div>
                        : <div className={dflex}>
                            <img className={userstockpicture} src={userStockImage.src} alt={"user sprite"} />
                            <li className={`${firsttile} nav-link text-white`}>{username}</li>
                        </div>

                }
            </Nav.Item>
            <Nav.Item>
                <Link className={"nav-link text-white"} href="/home">Home</Link>
            </Nav.Item>
            <Nav.Item>
                <Link className={"nav-link text-white"} href="/stats">Stats</Link>
            </Nav.Item>
            {
                user.name
                  ? <Nav.Item>
                    <Link className={"nav-link text-white"} href={'/api/auth/logout'} onClick={handleLogoutClick}>Logout</Link>
                  </Nav.Item>
                  : <Nav.Item>
                      <Link className={"nav-link text-white"} href={'/api/auth/login'} >Login</Link>
                  </Nav.Item>
            }
            <Nav.Item style={{ display: "contents" }}>
            </Nav.Item>
            <li style={{ marginLeft: "auto" }} className={"nav-link text-white"}>
                Score: {
                    user.name
                        ? current_points.find(userPointsObject => userPointsObject.user === user.name)?.points
                        : current_points.find(userPointsObject => userPointsObject.user === username)?.points
                }
            </li>
        </Nav>
    );
}