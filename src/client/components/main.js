import React from 'react';
import ListingsContainer from './listingsContainer.js';
import PostListing from './PostListing.js';
import PostDog from './postDog.js';
import LoginForm from './loginForm.js';
import RegisterForm from './registerForm.js';
import jwt from 'jsonwebtoken';
import ProfileUpdate from './profileForm.js';
import ShowProfile from './showProfile.js';
import Search from './search.js'
import masterUrl from '../utils/masterUrl.js';
import request from 'superagent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Pets from 'material-ui/svg-icons/action/pets';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

// This component is the upper level component for all other components.
export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: [],
      query: '',
      openDrawer: false,
      openPostListing: false,
      openPostDog: false,
      renderProfile: false,
      openLogin: false,
      openRegister: false,
      openLoginMessage: false
    }

    this.authLogin = () => {
      let token = localStorage.getItem('jwt');
      if (token !== "undefined" && token !== null && token !== undefined) {
        return true;
      } else {
        return false;
      }
    }

    // Drawer - Opens the side drawer for my profile
    this.touchTap = () => {
      if (this.authLogin()) {
        this.setState({openDrawer: !this.state.openDrawer});
      } else {
        this.setState({openLoginMessage: !this.state.openLoginMessage})
      }
    }

    // Drawer - Styles for the side drawer buttons
    this.styles = {
      margin: 40,
    }

    // Drawer - Handles logout by removing jwt token and refreshing the page
    this.logoutOnClick = (event) => {
      localStorage.removeItem('jwt');
      window.location.reload();
    }

    // Drawer - Renders Edit Your Profile when Edit Profile button is clicked
    this.profileOnClick = (event) => {
      this.setState({renderProfile: !this.state.renderProfile});
    }

    // PostListing - Opens modal to post a listing
    this.postListing = (event) => {
      this.setState({openPostListing: !this.state.openPostListing});
    }

    //PostDog - Opens modal to post a listing
    this.postDog = () => {
      console.log('Posting Dog')
      this.setState({openPostDog: !this.state.openPostDog});
    }

    this.loginToggle = () => {
      this.setState({openLogin: !this.state.openLogin});
    };

    this.registerToggle = () => {
      this.setState({openRegister: !this.state.openRegister});
    };

    this.loginMessageToggle = () => {
      this.setState({openLoginMessage: !this.state.openLoginMessage});
    };

    // Search - live search by zipcode
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
  }

  // Populates listings on load
  componentDidMount() {
    this.handleSearch('');
    let token = localStorage.getItem('jwt');
    let decoded = jwt.decode(token);
  }

  // Renders AppBar, Search, Drawer, and PostListing
  render() {
    const actions = [
      <FlatButton
        label="Login"
        primary={true}
        onClick={this.loginToggle}
      />,
      <FlatButton
        label="Register"
        primary={true}
        onClick={this.registerToggle}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.loginMessageToggle}
      />,
    ];
    return (
      <MuiThemeProvider>
      <div>
        <Toolbar style={{background: 'rgb(197, 186, 155)'}}>
          <ToolbarGroup firstChild={true}>
            <IconButton onClick={this.postListing}><Pets/></IconButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <Search onChange={this.handleSearch} authLogin={this.authLogin}/>
          </ToolbarGroup>

          <ToolbarGroup>
            <RaisedButton label="Login" onClick={this.loginToggle}/>
            <RaisedButton label="Register" onClick={this.registerToggle}/>
          </ToolbarGroup>

          <ToolbarGroup lastChild={true}>
            <IconButton onClick={this.touchTap}><NavigationMenu/></IconButton>
          </ToolbarGroup>
        </Toolbar>

        <ListingsContainer listings={this.state.listings} />
        <Drawer width={400} openSecondary={true} open={this.state.openDrawer} >
          <AppBar title="Sit-n-Paws Profile" onLeftIconButtonTouchTap={this.touchTap} style={{background: 'rgb(197, 186, 155)'}}/>
          <ShowProfile/>
          <RaisedButton onClick={this.profileOnClick} label="Edit Profile" labelColor="white" style={this.styles} backgroundColor="rgb(197, 186, 155)" />
          <RaisedButton onClick={this.logoutOnClick} label="Log Out" labelColor="white" style={this.styles} backgroundColor="rgb(171, 94, 94)"/>
          <RaisedButton onClick={this.postDog} label="Add dog profile" labelColor="white" style={this.styles} backgroundColor="rgb(171, 94, 94)"/>
          {this.state.renderProfile ? <ProfileUpdate/> : null}
        </Drawer>

        <Dialog
          modal={false}
          title="Host A Dog Today!"
          open={this.state.openPostListing}
          onRequestClose={this.postListing}
          autoScrollBodyContent={true}
        >
          <PostListing />
        </Dialog>

        <Dialog
          modal={false}
          open={this.state.openPostDog}
          onRequestClose={this.postDog}
          autoScrollBodyContent={true}
        >
          <PostDog />
        </Dialog>

        <Dialog
          modal={false}
          open={this.state.openLogin}
          onRequestClose={this.loginToggle}
          autoScrollBodyContent={true}
        >
          <LoginForm onSuccess={this.loginToggle} onSwitch={this.registerToggle}/>
        </Dialog>

        <Dialog
          modal={false}
          open={this.state.openRegister}
          onRequestClose={this.registerToggle}
          autoScrollBodyContent={true}
        >
          <RegisterForm onSuccess={this.registerToggle} onSwitch={this.loginToggle}/>
        </Dialog>

        <Dialog
          title="Users Only!"
          actions={actions}
          modal={false}
          onRequestClose={this.loginMessageToggle}
          open={this.state.openLoginMessage}
        >
        </Dialog>

      </div>
      </MuiThemeProvider>
    )
  }
}
