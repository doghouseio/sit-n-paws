import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import LoginSubmit from '../utils/login';
import './loginForm.css';


export default class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confPassword: '',
      email: '',
      formWarning: ''
    };

    this.handleSubmit = (e) => {
      e && e.preventDefault();
      if (this.validateForm()) {
        var credentials = {
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        };

        LoginSubmit('/signup', credentials, (res) => {
          if(res.success === true) {
              localStorage.setItem('jwt', res.token);
            } else {
              this.setState({formWarning: res.error});
            }
        });
      }
    }
  }


  validateForm() {
    if (!this.state.username) {
      this.setState({formWarning: 'Please enter a username'});
      return false;
    } else if (this.state.password && this.state.password !== this.state.confPassword) {
      this.setState({formWarning: 'Passwords must match, please try again.'});
      return false;
    } else if (!this.state.password || !this.state.confPassword) {
      this.setState({formWarning: 'Please enter a password.'});
      return false;
    } else {
      return true;
    }
  }

  render () {
    return (
        <MuiThemeProvider>
            <div className="login-container flex flex-col flex-center">
              <div className="login-title">Register</div>
              <form onSubmit={e => this.handleSubmit(e)}>
                <input
                  type="text"
                  className="login-form-control"
                  id="username"
                  placeholder="Username"
                  onChange={e => this.setState({username: e.target.value})}
                />
                <input
                  type="email"
                  className="login-form-control"
                  id="email"
                  placeholder="Email"
                  onChange={e => this.setState({'email': e.target.value})}
                />
                <input
                  type="password"
                  className="login-form-control"
                  id="password"
                  placeholder="Password"
                  onChange={e => this.setState({'password': e.target.value})}
                />
                <input
                  type="password"
                  className="login-form-control"
                  id="confPassword"
                  placeholder="Confirm password"
                  onChange={e => this.setState({'confPassword': e.target.value})}
                />
                <FlatButton type="submit" primary={true} className="login-btn login-form-control" label="Register" />
                {this.state.formWarning && (<div className="login-warning">{this.state.formWarning}</div>)}
                <div className="login-form-control">
                  <button className="login-link">Already have an account? Login now</button>
                </div>
              </form>
            </div>
        </MuiThemeProvider>
    );
  }
}