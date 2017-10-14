import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import MyMap from './Map.js';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import jwt from 'jsonwebtoken';
import masterUrl from '../utils/masterUrl.js';
import request from 'superagent';


export default class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: props.listing.name,
      hostEmail: props.listing.email,
      ownerEmail: null,
      zipcode: props.listing.zipcode,
      dogSizePreference: props.listing.dogSizePreference,
      dogBreedPreference: props.listing.dogBreedPreference,
      dogActivityPreference: props.listing.dogActivityPreference,
      homeAttributes: props.listing.homeAttributes,
      hostPictures: props.listing.hostPictures,
      homePictures: props.listing.homePictures,
      cost: props.listing.cost,
      yard: props.listing.yard,
      children: props.listing.children,
      pets: props.listing.pets,
      position: props.listing.position,
      date: null, //TODO, import date handling functionality
      open: false,
      dogs: props.dogs,
      dogsPictures: props.dogsPictures
    }
    //handle 'contact me'



    this.handleOpen = () => {
      this.setState({open: true});
    }

    // Closes the modal upon clicking contact me
    this.handleClose = () => {
      this.setState({open: false});
    }

    this.handleChangeDate = (e, date) => {
      this.setState({date: date});
      console.log(date);
    }

    this.handleSendEmail = () => {
      this.setState({open: false});
      const url = `/contacthost`;
      let body = {
        ownerEmail: this.state.ownerEmail,
        hostEmail: this.state.hostEmail,
        date: JSON.stringify(this.state.date)
      }
      console.log('body',body)
      request
        .post(url)
        .send(body)
        .end((err, res) => {
          if (err) {
            console.log('There was an error sending email: ', err)
          } else {
            console.log(res);
          }
        });
    }
  }



  componentDidMount() {
    let token = localStorage.getItem('jwt');
    let decoded = jwt.decode(token);
    //this.setState({name: decoded.name});
    this.setState({ownerEmail: decoded.email})
  }

  render() {
      const actions = [
        <FlatButton
        label="Cancel"
        secondary={true}
        onClick={this.handleClose}
        />,
        <FlatButton
          label="Send Message"
          primary={true}
          keyboardFocused={true}
          onClick={this.handleSendEmail}
        />
      ];

      function RenderDogs(props) {
        const dogs = props.dogs;
        const pics = props.pics;
        if (dogs === null) {
          return (<div>This user does not own dogs</div>)
        }
        if (dogs.length) {
          const dogListItems = dogs.map((dog, index) =>
          <li key={index}>
            Name: {dog.name} <br />
            Age: {dog.age} <br />
            Bio: {dog.bio} <br />
            Breed: {dog.dogBreed} <br />
            <img src={pics[index]} style={{height: "auto"}} alt="Dog Picture" width="240" height="180" />
            </li>
        )
        return (
          <ul>{dogListItems}</ul>
        )
        } else return (<div>This user does not own dogs</div>)


      }
      return (
        <div>
          <Card>
            <CardHeader
            title={this.state.name}
            subtitle={"Puppy Lover in: " + this.state.zipcode}
            avatar={this.state.hostPictures}
          />
          <CardMedia
            overlay={<CardTitle title={`$${this.state.cost} Per Night!`} subtitle={this.state.homeAttributes} />}
          >
            <img src={this.state.homePictures} style={{height: "auto"}} alt="Home Picture" width="360" height="270" />
          </CardMedia>
          <CardTitle title="5 Stars"
           subtitle={`Max Dog Size:${this.state.dogSizePreference}`} />
          <CardText>
            <div className = "listing">
              {`Preferred Dog Breed: ${this.state.dogBreedPreference}. `} <br/>
              {`Preferred Dog Activities: ${this.state.dogActivityPreference}`} <br/>
              {`Yard Size: ${this.state.yard}. `} <br/>
              {`Other Pets: ${this.state.pets}`} <br/>
              {`Children: ${this.state.children}`} <br/>
              {`Description: ${this.state.homeAttributes}`}
            </div>
            <div className="dogs-info">
              <h2>Dog(s) living here</h2>
              <RenderDogs pics={this.state.dogsPictures} dogs={this.state.dogs} />

            </div>
            <div>
              <MyMap position={this.state.position}/>
            </div>
          </CardText>
          <CardActions>
            <FlatButton label="Contact Me" onClick={this.handleOpen}/>
            <Dialog
              title= {`Send ${this.state.name} a message`}
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
            >
            One last thing...pick a date:
            <DatePicker
              hintText="Pick a Date"
              value={this.state.date}
              onChange={this.handleChangeDate}
            />
            </Dialog>
          </CardActions>
          </Card>

        </div>
      );

  };
}
