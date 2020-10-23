import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import FaceLogin from './FaceLogin';
import Logout from './Logout';
import Home from './Home';
import Account from './Account';
import UserStorage from './storage/UserStorate';

import 'bootstrap/dist/css/bootstrap.css';

import { Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const NavRoute = function({path, component: Component}) {
    
    let userLoginMenus = [
        <Nav.Link href="/login" key="login">Login</Nav.Link>,
        <Nav.Link href="/register" key="register">Register</Nav.Link>
    ]
    
    let userLogoutMenus = [
        <Nav.Link href="/account" key="account">Account</Nav.Link>,
        <Nav.Link href="/logout" key="logout">Logout</Nav.Link>
    ]
    
    return (
        <Route path={path} render={(props) => (
            <div>
                <Navbar bg="dark" variant="dark" expand="md">
                  <Navbar.Brand href="/">Home</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                      { UserStorage.isLoggedIn() ? null : userLoginMenus }
                      { UserStorage.isLoggedIn() ? userLogoutMenus : null}
                    </Nav>
                  </Navbar.Collapse>
                </Navbar>
                <div className="mt-4">
                    <Component {...props}/>
                </div>
            </div>
        )}/>
    )
}

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <NavRoute path="/login" component={Login}/>
                        <NavRoute path="/register" component={Register}/>
                        <NavRoute path="/face_login" component={FaceLogin}/>
                        <NavRoute path="/logout" component={Logout}/>
                        <NavRoute path="/account" component={Account}/>
                        <NavRoute path="/" component={Home}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
