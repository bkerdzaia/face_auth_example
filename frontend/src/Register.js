import React, { Component } from 'react';

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

import UserStorage from './storage/UserStorate';


class Register extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = { errorText: '', showError: false }
        this.onTextChange = this.onTextChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    
    onTextChange() {
        this.setState({
            errorText: '', showError: false
        })
    }
    
    async onSubmit(event) {
        event.preventDefault()
        
        let form = event.currentTarget
        let formData = new FormData(form)
        
        let object = {};
        formData.forEach((value, key) => {object[key] = value});
        let jsonData = JSON.stringify(object);
        
        try {
            
            let response = await fetch('/api/users/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: jsonData
            })
            
            let result = await response.json()
            
            if (!result.access_token) {
                let errorText = ''
                if (typeof(result.detail) === 'string') {
                    errorText = result.detail
                } else if (result.detail[0].msg) {
                    errorText = result.detail[0].msg
                }
                this.setState(
                    { errorText: errorText, showError: true }
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
                        <Form className="w-50 mx-auto" onSubmit={this.onSubmit}>
                            <Form.Group controlId="formRegisterName">
                                <Form.Label>
                                    Username
                                </Form.Label>
                                <Form.Control
                                    name="name"
                                    type="text"
                                    onChange={this.onTextChange}
                                    placeholder="Enter name" />
                                { this.state.showError ?
                                <Form.Text className="text-danger">
                                    {this.state.errorText}
                                </Form.Text> : null}
                            </Form.Group>
                            
                            <Form.Group controlId="formRgisterPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Register
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Register;
