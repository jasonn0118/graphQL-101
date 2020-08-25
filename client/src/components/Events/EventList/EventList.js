import React from 'react';
import EventItem from './EventItem/EventItem';
import './EventList.css';

const EventList = (props) => {
  const events = props.events.map((event) => {
    console.log(event,'>>>>>>>>>>>>Event')
    return <EventItem key={event._id} eventId={event._id} title={event.title} price={event.price} userId={props.authUserId} />;
  });
  return <ul className='event-list'>{events}</ul>;
};

export default EventList;
