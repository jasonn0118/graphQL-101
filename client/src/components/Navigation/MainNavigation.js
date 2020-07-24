import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';

const MainNavigation = (props) => {
  return (
    <header className="main-nav">
      <div className='main-nav_logo'>
        <h1>Easy Event</h1>
      </div>
      <nav className="main-nav_items">
        <ul>
          <li>
            <NavLink to='/auth'>Authentication</NavLink>
          </li>
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          <li>
            <NavLink to='/bookings'>Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
