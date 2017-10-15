import React from 'react';
import ListingView from './listingView';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FontIcon from 'material-ui/FontIcon';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import jwt from 'jsonwebtoken';
import PostDog from './postDog.js';
import confirmBooking from '../utils/confirmBooking.js';

import {
  blue300,
  indigo900,
  orange200,
  deepOrange300,
  pink400,
  purple500,
} from 'material-ui/styles/colors';

// Shows the profile in the drawer
export default class ShowProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hostBookings: props.hostBookings,
      guestBookings: props.guestBookings,
      openPostDog: false,
      name: null,
      email: props.user.email,
      address: props.user.address,
      dogs: props.user.dogs,
      dogsPictures: props.user.dogsPictures,
      avatar: "https://i.imgur.com/katTIZJ.png"
    }

    this.styles = {
      width: 140,
      height: 140
    }

    this.postDog = () => {
      this.setState({openPostDog: !this.state.openPostDog});
    }
    this.handleConfirm = (e) => {
      let id = e.target.getAttribute('data-id');
      let confirmed = e.target.getAttribute('data-confirmed')
      let body = {
        id: id,
        confirmed: !confirmed
      }
      let url = '/bookings';
      confirmBooking(url, body, (res) => {
        if (res.success === true) {
          console.log('Dog submitted!');
          this.setState({message: res.message});
          this.setState({submitted: true});
        } else {
          console.log('Error: ', res.error);
        }
      });
    }
  }



  componentWillMount() {
    if (localStorage.jwt) {
      var token = localStorage.jwt;
      var decoded = jwt.decode(token);
      this.setState({name: decoded.username});
    }
  }

  render() {

    function RenderDogs(props) {
        const dogs = props.dogs;
        const pics = props.pics;
        if (dogs === null || dogs === undefined) {
          return (<div>You have not added a profile for your dog(s) yet!</div>)
        }
        if (dogs.length) {
          const dogListItems = dogs.map((dog, index) =>
          <li key={index}>
            Name: {dog.name} <br />
            Age: {dog.age} <br />
            Bio: {dog.bio} <br />
            Breed: {dog.dogBreed} <br />
            Size: {dog.dogSize} <br />
            Activity requirements: {dog.dogActivityReq} <br />
            <img src={pics[index]} style={{height: "auto"}} alt="Dog Picture" width="240" height="180" />
            </li>
        )
        return (
          <ul>{dogListItems}</ul>
        )
        } else return (<div>You have not added a profile for your dog(s) yet!
          <FlatButton label="New dog!" onClick={this.setState({openPostDog: !this.state.openPostDog})
}>Click here to add a dog profile!</FlatButton> </div>)

      }
      function RenderHostings(props) {
        const host = props.host
        if (host.length) {
          const hostListItems = host.map((listing, index)=>
            <li key={index}>
              <div>Guest: {listing.guestEmail}</div>
              <div>Date: {listing.date.substring(1, 11)}</div>
              <div>Confirmed?: <b>{listing.confirmed ? 'Yes' : 'No'}</b></div>

            </li>
          )
          return (<ul>{hostListItems}</ul>)
        } else return (<div>You do no currently have any guests booked!</div>)
      }
      const RenderGuestings = (props) => {
        const guest = props.guest
        console.log('GUEST', guest)
        if (guest.length) {
          const guestListItems = guest.map((listing, index)=>
            <li key={index}>
              <div>Host: {listing.hostEmail}</div>
              <div>Date: {listing.date.substring(1, 11)}</div>
              <div>Confirmed?: <b>{listing.confirmed ? 'Yes' : <span>No<button data-confirmed={listing.confirmed} data-id={listing._id} label="Confirm Booking" onClick={e => this.handleConfirm(e)} >Confirm</button></span>}</b></div>

            </li>
          )
          return (<ul>{guestListItems}</ul>)
        } else {
          return (<div>You do not currently have any dates booked! Search listings to find the right host!</div>)
        }
      }

    return (
      <div className='profileBox'>
<<<<<<< HEAD
        <h1>{this.state.name}</h1>
        <h3>Email: {this.props.user.email} </h3>
        <h3>Address: {this.props.user.address} </h3>
=======
>>>>>>> 47798eb16fcf525e9a101707d09b7700cf864024
        <Avatar style={this.styles}
        backgroundColor='rgba(0,0,0,0)'
        alt="User Picture"
        src={this.state.avatar}
        />
        <h2>Important dates</h2>
        <h4>You are hosting the following bookings</h4>
        <RenderHostings host={this.props.hostBookings} />
        <h4>You have the following dates booked with other hosts</h4>
        <RenderGuestings guest={this.props.guestBookings} />
        <h2>Your dogs!</h2>
        <RenderDogs pics={this.props.dogsPictures} dogs={this.props.dogs} />
        <Dialog
          modal={false}
          open={this.state.openPostDog}
          onRequestClose={this.postDog}
          autoScrollBodyContent={true}
        >
          <PostDog />
        </Dialog>
      </div>

    );
  };
}


   // if (listing.confirmed) {
   // //                <div>Yes</div>
   // //              } else {
   //                <div><IconButton tooltip="Confirm Booking" tooltipPosition="bottom-right" onClick={this.handleConfirm}>Click to confirm dates</IconButton></div>
   //              }
   //            }