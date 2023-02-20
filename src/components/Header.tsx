import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import { Navbar } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {selectPoints, setUserInitialPoints} from "../features/points/PointsSlice";
import {selectGuest} from "../features/guest/GuestSlice";
import {selectUser, unSetUser} from "../features/user/UserSlice";
import {generateGuest} from "../utils/Utils";
import userStockImage from "../images/user.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/components/Header.module.scss';

export default function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const {push} = useRouter();
  const { user } = useAppSelector(selectUser);
  const username = useAppSelector(selectGuest);
  const { header, dflex, userpicture, userstockpicture, firsttile, navbarCustomCollapse, navbarCustomToggle, scoreLink, scoreLinkGuest } = styles;
  const { initial_points, current_points } = useAppSelector(selectPoints);
  const [width, setWidth] = useState<number>(window.innerWidth);

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

  useEffect(() => {
    window.addEventListener('resize', handleWidth);

    return () => window.removeEventListener('resize', handleWidth);
  }, [window.innerWidth]);

  const handleWidth = () => {
    setWidth(window.innerWidth);
  }

  const handleLogoutClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    dispatch(unSetUser());
    push('/api/auth/logout');
  }

  const ScoreNavItem = (): JSX.Element => {
    return (
      <Nav id={user && user.name ? scoreLink : scoreLinkGuest}>
        <div className={"nav-link text-white"}>
          Score: {
          user.name
            ? current_points.find(userPointsObject => userPointsObject.user === user.name)?.points
            : current_points.find(userPointsObject => userPointsObject.user === username)?.points
        }
        </div>
      </Nav>
    );
  }

  return (
    <Navbar
      id={header}
      expand={"lg"}
    >
      <Navbar.Brand>
        <div className={dflex}>
          <img
            className={user.name ? userpicture : userstockpicture}
            src={user.picture ? user.picture :  userStockImage.src}
            alt={
              user.name
                ? user.name
                : "user sprite"
            }
          />
          <Link
            className={`${firsttile} nav-link text-white`}
            href={"profile"}
          >
            {user.name ? user.name : username}
          </Link>
        </div>
      </Navbar.Brand>
      {
        width <= 912
        && <ScoreNavItem />
      }
      <Navbar.Toggle
        id={navbarCustomToggle}
        aria-controls={navbarCustomCollapse}
      />
      <Navbar.Collapse id={navbarCustomCollapse}>
        <Nav>
          <Nav.Item>
            <Link
              className={"nav-link text-white"}
              href="/home"
            >
              Home
            </Link>
          </Nav.Item>
          <Nav.Item>
          {
            user.name
              ? <Link className={"nav-link text-white"} href={'/api/auth/logout'} onClick={handleLogoutClick}>Logout</Link>
              : <Link className={"nav-link text-white"} href={'/api/auth/login'}>Login</Link>
          }
          </Nav.Item>
        </Nav>
        {
          width > 912
          && <ScoreNavItem />
        }
      </Navbar.Collapse>
    </Navbar>
  );
}