import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false,
    events: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const reqBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
          }
        }
      `,
    };
    const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((resData) => {
        this.fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  fetchEvents = () => {
    const reqBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        this.setState({
          events: events
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    const eventList = this.state.events.map(event => {
      return <li key={event._id} className='events-list-item'>{event.title}</li>
    })
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title='Add Event'
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className='form-control'>
                <label htmlFor='title'>TItle</label>
                <input type='text' id='title' ref={this.titleElRef}></input>
              </div>
              <div className='form-control'>
                <label htmlFor='price'>Price</label>
                <input type='number' id='price' ref={this.priceElRef}></input>
              </div>
              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input
                  type='datetime-local'
                  id='date'
                  ref={this.dateElRef}
                ></input>
              </div>
              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea
                  row='4'
                  id='description'
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className='events-control'>
            <p>Share your own Events!</p>
            <button className='btn' onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className='events-list'>
          {eventList}
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
