import Nav from 'react-bootstrap/Nav';
import Link from "next/link";
import { useAppSelector } from "../app/hooks";
import useGuest from "../features/guest/useGuest";
import { useUser } from '@auth0/nextjs-auth0/client';
import { selectPoints } from "../features/points/PointsSlice";
import styles from '../../styles/components/Header.module.scss';
import userStockImage from "../images/user.png";

export default function Header() {
    const { user } = useUser();
    const { username } = useGuest();
    const { header, dflex, userpicture, userstockpicture, firsttile } = styles;
    const { current_points } = useAppSelector(selectPoints);

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
                user && <Nav.Item>
                    <Link className={"nav-link text-white"} href={'/api/auth/logout'}>Logout</Link>
                </Nav.Item>
            }
            <Nav.Item style={{ display: "contents" }}>
                <li style={{ marginLeft: "auto" }} className={"nav-link text-white"}>Score: {current_points}</li>
            </Nav.Item>
        </Nav>
    );
}