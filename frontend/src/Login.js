import React from 'react';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {Redirect, Link} from 'react-router-dom';

import UserStorage from './storage/UserStorate';

class Login extends React.Component {
    
    constructor(props) {
        super (props)
        
        this.state = { errorText: '', showError: false }
        this.onLogin = this.onLogin.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
    }
    
    onTextChange() {
        this.setState({
            errorText: '', showError: false
        })
    }
    
    async onLogin(event) {
        event.preventDefault()
        
        let form = event.currentTarget
        
        try {
        
        
            let response = await fetch('/api/login/access-token', {
                method: 'POST',
                body: new FormData(form)
            })
        
            let result = await response.json()
            
            if (!result.access_token) {
                this.setState(
                    { errorText: result.detail, showError: true }
                )
            } else {
                UserStorage.login(result.access_token)
                this.props.history.push('/')
            }
        
        } catch (e) {
            console.error(e);
        }
    }
    
    render() {
        if (UserStorage.isLoggedIn()) {
            return <Redirect to='/'/>
        }
        return (
            <Container className="mt-3">
                <Row>
                    <Col>
                        <Form className="w-50 mx-auto" onSubmit={this.onLogin}>
                            <Form.Group controlId="formLoginUsername">
                                <Form.Control
                                    name="username"
                                    type="text"
                                    onChange={this.onTextChange}
                                    placeholder="Enter Username" />
                                { this.state.showError ?
                                <Form.Text className="text-danger">
                                    {this.state.errorText}
                                </Form.Text> : null}
                            </Form.Group>
                            
                            <Form.Group controlId="formLoginPassword">
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Enter Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                            <div>
                            Or <Link to="/face_login">Login Using Face Detection</Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Login;
