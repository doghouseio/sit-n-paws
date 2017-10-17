import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import jwt from 'jsonwebtoken';
import request from 'superagent';
import masterUrl from '../utils/masterUrl.js';
import ProfileView from './profileView.js';


// This is the component for each individual listing.
// It has its own state to manage the email information
// of each individual listing.
export default class ListingView extends React.Component {
  constructor(props) {
    super (props);

    this.state = {
      hostEmail: props.listing.email,
      ownerEmail: null,
      open: false,
      date: null,
      openProfileView: false,
      dogs: null,
      dogsPictures: null
    }

    // Opens the modal upon clicking contact me
    this.handleOpen = () => {
      this.setState({open: true});
    }

    // Closes the modal upon clicking contact me
    this.handleClose = () => {
      this.setState({open: false});
    }

    // Handles the date change in contact me
    this.handleChangeDate = (e, date) => {
      this.setState({date: date});
    }

    // ProfileView - Opens modal to view profile
    this.profileView = () => {
      this.setState({openProfileView: !this.state.openProfileView});
    }

    this.handleSearch = (term) => {
      const url = `/listings/${term}`;
      request.get(url, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          this.setState({ listings:res.body });
        }
      });
    }

    this.getDogData = (email, callback) => {
      const url = '/dog?email=' +email;
      request.get(url, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          callback(res.body)
        }

      });
    }

    this.getDogPictureData = (email, callback) => {
      const url = '/dogpics?email=' +email;
      request.get(url, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          callback(res.body)
        }
      });
    }


    let outer = this;
    this.getDogData(outer.state.hostEmail, function(dogs) {
      outer.setState({dogs:dogs});
    });

    this.getDogPictureData(outer.state.hostEmail, function(pics) {
      outer.setState({dogsPictures:pics});
    });

    this.handleCardClick = (e) => {
      e && e.preventDefault();
      if (this.props.checkAuth()) {
        this.profileView();
      } else {
        this.props.openLoginMessage();
      }
    }
  }

  // When component loads, retrieves and decodes jwt and extracts user's email
  // from token.
  componentDidMount() {
    if (localStorage.jwt) {
      var token = localStorage.jwt;
      var decoded = jwt.decode(token);
      this.setState({ownerEmail: decoded.email});
    }
  }

  render() {
    // These are the action buttons for the Dialog
    // const actions = [
    //   <FlatButton
    //   label="Cancel"
    //   secondary={true}
    //   onClick={this.handleClose}
    //   />,
    //   <FlatButton
    //     label="Send Message"
    //     primary={true}
    //     keyboardFocused={true}
    //     onClick={this.handleSendEmail}
    //   />
    // ];

    // Refer to material-ui cards for more info on changing card styles
    // Each props.listing is passed from Main to listingsContainer to listingView
    return (
      <div>
        <Card onClick={this.handleCardClick}>
        {this.props.checkAuth() ?
          <CardHeader
            title={this.props.listing.name}
            subtitle={"Puppy Lover in: " + this.props.listing.zipcode}
            avatar={this.props.listing.hostPictures}
          />
          :
          <CardHeader
            subtitle="Login to see details and book!"
          />
        }
          <CardMedia
            overlay={<CardTitle title={`$${this.props.listing.cost} Per Night!`} subtitle={this.props.listing.homeAttributes} />}
          >
            <img src={this.props.listing.homePictures} alt="Home Picture" width="360" height="270" />
          </CardMedia>
          <CardTitle title="5 Stars"
           subtitle={`Max Dog Size:${this.props.listing.dogSizePreference}`} />
          <CardText>
            <div className = "listing">
              {`Preferred Dog Breed: ${this.props.listing.dogBreedPreference}. `} <br/>
              {`Yard Size: ${this.props.listing.yard}. `} <br/>
              {`Pets: ${this.props.listing.pets}`} <br/>
              {`Description: ${this.props.listing.homeAttributes}`}
            </div>
          </CardText>
        </Card>
        <Dialog
          modal={false}
          open={this.state.openProfileView}
          onRequestClose={this.profileView}
          autoScrollBodyContent={true}
        >
          <ProfileView dogsPictures={this.state.dogsPictures}
            dogs={this.state.dogs}
            listing={this.props.listing}
            updateGuestBookings={this.props.updateGuestBookings}
            updateHostBookings={this.props.updateHostBookings}
            user={this.props.user}
          />
        </Dialog>
      </div>
    )
  }
}
// ListingView.propTypes = {listing: PropTypes.object.isRequired};
// dogs={this.state.dogs}
