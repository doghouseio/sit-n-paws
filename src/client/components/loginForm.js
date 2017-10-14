import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import LoginSubmit from '../utils/login';
import './loginForm.css';


export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      formWarning: ''
    };
  }

  handleSubmit(e) {
    e && e.preventDefault();
    if (this.validateForm()) {
      var credentials = {
        username: this.state.username,
        password: this.state.password
      };

      LoginSubmit('/login', credentials, (res) => {
        if(res.success === true) {
            localStorage.setItem('jwt', res.token);
          } else {
            this.setState({formWarning: res.error});
          }
      });
    }
  }
  validateForm() {
    if (!this.state.username) {
      this.setState({formWarning: 'Please enter a username'});
    } else if (!this.state.password) {
      this.setState({formWarning: 'Please enter a password.'});
    } else {
      return true;
    }
  }

  render () {
    return (
      <MuiThemeProvider>
          <div className="login-container flex flex-col flex-center">
            <div className="login-title">Login</div>
            <form className="login-form" onSubmit={e => this.handleSubmit(e)}>
              <input
                type="text"
                className="login-form-control"
                id="username"
                placeholder="Username"
                onChange={e => this.setState({'username': e.target.value})}
              />
              <input
                type="password"
                className="login-form-control"
                id="password"
                placeholder="Password"
                onChange={e => this.setState({'password': e.target.value})}
              />
              <div>
                <FlatButton type="submit" primary={true} className="login-btn login-form-control" label="Login" />
              </div>
              {this.state.formWarning && (<div className="login-warning">{this.state.formWarning}</div>)}
              <div className="login-form-control">
                <button className="login-link">Register</button>
              </div>
            </form>
          </div>
      </MuiThemeProvider>
    );
  }
}