import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import submitDog from '../utils/submitDog.js';
import jwt from 'jsonwebtoken';
import TextField from 'material-ui/TextField';
import masterUrl from '../utils/masterUrl.js';

export default class PostDog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dogSize: '',
      dogBreed: '',
      dogActivityReq: '',
      bio: '',
      dogPictures: null,
      age: 0,
      submitted: false,
      error: null,
      message: 'Success, your doggo has been added to your profile!',
      userEmail: null
    }

    //handles input fields
    this.setField = (e) => {
      if (e.target.type === 'file') {
        this.setState({[e.target.name]: e.target.files[0]});
      } else {
        this.setState({[e.target.name]: e.target.value});
      }
    }

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
      formData.append("dogSize", this.state.dogSize);
      formData.append("dogBreed", this.state.dogBreed);
      formData.append("dogActivityReq", this.state.dogActivityReq);
      formData.append("bio", this.state.bio);
      formData.append("dogPictures", this.state.dogPicture);
      formData.append("age", this.state.age);
      formData.append("email", this.state.userEmail);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      let url = '/dog';

      submitDog(url, formData, (res) => {
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

  componentDidMount() {
    let token = localStorage.getItem('jwt');
    let decoded = jwt.decode(token);
    this.setState({userEmail: decoded.email})

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

                <TextField floatingLabelText="Dog's name" value={this.state.name} name="name"/>

                <TextField floatingLabelText="Dog's size" value={this.state.dogSize} name="dogSize"/>

                <TextField floatingLabelText="Dog's breed" value={this.state.dogBreed} name="dogBreed"/>

                <TextField floatingLabelText="Dog's activity requirements" value={this.state.dogActivityReq} name="dogActivityReq"/>

                <TextField floatingLabelText="Dog's story" value={this.state.bio} multiLine={true} rows={2} name="bio"/>

                <TextField floatingLabelText="Dog's age" value={this.state.age} name="age"/>

                <label htmlFor="dogPicture" className="postListing-fileLabel">{this.state.dogPicture ? this.state.dogPicture.name : `Choose a Picture of your dog`}</label><br />
                <input type="file" name="dogPicture" id="dogPicture" className="postListing-file" /><br />
                </div>
              </div>
            <div>
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
