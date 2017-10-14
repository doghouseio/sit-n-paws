import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import submitListing from '../utils/submitListing.js';
import jwt from 'jsonwebtoken';
import masterUrl from '../utils/masterUrl.js';
import axios from 'axios';
import TextField from 'material-ui/TextField';
export default class PostListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      zipcode: '',
      dogSizePreference: '',
      dogBreedPreference: '',
      dogActivityPreference: '',
      pets: '',
      children: '',
      homeAttributes: '',
      yard: '',
      hostPictures: null,
      homePictures: null,
      cost: '',
      street: '',
      city: '',
      state: '',
      submitted: false,
      error: null,
      message: 'Thank you, your listing has been successfully submitted!'
    }

    //handles input fields
    this.setField = (e) => {
      if (e.target.type === 'file') {
        this.setState({[e.target.name]: e.target.files[0]});
      } else {
        this.setState({[e.target.name]: e.target.value});
      }
    }
//decoded.email in didcomponentmount
    this.handleSubmit = () => {
      for (let key in this.state) {
        if (this.state[key] === '') {
          console.log('Form Error ', key);
          this.setState({error: `The following field is required: ${key}`});
          return;
        }
      }
      let formData = new FormData();
      formData.append("name", this.state.name);
      formData.append("email", this.state.email);
      formData.append("zipcode", this.state.zipcode);
      formData.append("dogSizePreference", this.state.dogSizePreference);
      formData.append("dogBreedPreference", this.state.dogBreedPreference);
      formData.append("dogActivityPreference", this.state.dogActivityPreference);
      formData.append("homeAttributes", this.state.homeAttributes);
      formData.append("hostPictures", this.state.hostPictures);
      formData.append("homePictures", this.state.homePictures);
      formData.append("cost", this.state.cost);
      formData.append("yard", this.state.yard);
      formData.append("pets", this.state.pets);
      formData.append("children", this.state.children);
      formData.append("street", this.state.street);
      formData.append("city", this.state.city);
      formData.append("state", this.state.state);

      let url = '/listings';

      submitListing(url, formData, (res) => {
        if (res.success === true) {
          console.log('Listing submitted!');
          this.setState({message: res.message});
          this.setState({submitted: true});
        } else {
          console.log('Error: ', res.error);
        }
      });
    }
  }

  componentDidMount() {
    let token = localStorage.getItem('jwt');
    let decoded = jwt.decode(token);
    this.setState({name: decoded.name});
    this.setState({email: decoded.email});
  }

  render() {
    if (this.state.submitted === true) {
      return (
        <h1> {this.state.message} </h1>
      )
    } else {
      return (
        <div>
          {this.state.error ? <p className="postListing-error">{this.state.error}</p> : ''}
          <form onChange={this.setField} onSubmit={this.handleSubmit}>
            <div className="postListing">
              <div className="postListing-label">

                <TextField floatingLabelText="Name" value={this.state.name} name="name"/>

                <TextField floatingLabelText="Zip Code" value={this.state.zipcode} name="zipcode"/>

                <TextField floatingLabelText="Street" value={this.state.street} name="street"/>

                <TextField floatingLabelText="City" value={this.state.city} name="city"/>

                <TextField floatingLabelText="State" value={this.state.state} name="state"/>

                <TextField floatingLabelText="Preferred Dog Size" value={this.state.dogSizePreference} name="dogSizePreference"/>

                <TextField floatingLabelText="Preferred Dog Breed" value={this.state.dogBreedPreference} name="dogBreedPreference"/>

                <TextField floatingLabelText="Preferred Dog Activity" value={this.state.dogActivityPreference} name="dogActivityPreference"/>


              </div>
              <div className="postListing-label">

                <TextField floatingLabelText="Yard Size" value={this.state.yard} name="yard"/>

                <TextField floatingLabelText="Pets" value={this.state.pets} name="pets"/>

                <TextField floatingLabelText="Children" value={this.state.children} name="children"/>

                <TextField floatingLabelText="Cost Per Night" value={this.state.cost} name="cost"/>

                <TextField floatingLabelText="Description" multiLine={true} rows={2} value={this.state.homeAttributes} name="homeAttributes"/>

                <label htmlFor="hostPictures" className="postListing-fileLabel">{this.state.hostPictures ? this.state.hostPictures.name : `Choose a Picture of you`}</label><br />
                <input type="file" name="hostPictures" id="hostPictures" className="postListing-file" /><br />

                <label htmlFor="homePictures" className="postListing-fileLabel">{this.state.homePictures ? this.state.homePictures.name : `Choose a Picture of your home`}</label><br />
                <input type="file" name="homePictures" id="homePictures" className="postListing-file" /><br />
              </div>
            </div>
            <div >
              <FlatButton
              className="postListing-submit"
              label="Submit"
              primary={true}
              onClick={() => {
                this.handleSubmit();
              }}
              />
            </div>
          </form>
        </div>
      );
    };
  };
}
//no more email
//change Description:
  //yard Size
  //pets?
  //children?
  //
