//this component is no longer used, but could be useful if you choose to make a multi-page app
import React from 'react';
import PropTypes from 'prop-types';
import jwt from 'jsonwebtoken';
import LoginForm from './loginForm.js';
import RegisterForm from './registerForm.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Pets from 'material-ui/svg-icons/action/pets';


import './loginForm.css';


export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: false,
      register: false,
    };

    this.loginToggle = () => {
      this.setState({login: !this.state.login});
    };

    this.registerToggle = () => {
      this.setState({register: !this.state.register});
    };
  }
  // Login component checks for presence of jwt before it loads, if exists, redirects user to main
  componentWillMount() {
    let token = localStorage.getItem('jwt');
    if (token !== "undefined" && token !== null && token !== undefined) {
      this.props.history.push('/main');
    }
  }


  render() {
    return (
      <MuiThemeProvider>
        <Toolbar style={{background: 'rgb(197, 186, 155)'}}>
          <ToolbarGroup firstChild={true}>
            <IconButton><Pets/></IconButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton label="Login" onClick={this.loginToggle}/>
            <RaisedButton label="Register" onClick={this.registerToggle}/>
          </ToolbarGroup>
        </Toolbar>

        <Dialog
          modal={false}
          open={this.state.login}
          onRequestClose={this.loginToggle}
          autoScrollBodyContent={true}
        >
          <LoginForm />
        </Dialog>

        <Dialog
          modal={false}
          open={this.state.register}
          onRequestClose={this.registerToggle}
          autoScrollBodyContent={true}
        >
          <RegisterForm />
        </Dialog>

      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {handleLogin: PropTypes.func.isRequired};