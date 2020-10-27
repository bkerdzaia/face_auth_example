import React from 'react';

import { WebcamCapture } from './components/WebcamCapture';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

import UserStorage from './storage/UserStorate';


class FaceLogin extends React.Component {
    
    constructor(props) {
        super (props);
        
        this.state = { errorText: '', showError: false, processing: false }
        this.webcamPicture = React.createRef();
        this.onLogin = this.onLogin.bind(this);
    }
    
    async onLogin() {
        this.setState({processing: true})
        try {
        
            let formData = new FormData()
            let imgUrl = this.webcamPicture.current.getScreenshot()
            
            let blob = await fetch(imgUrl).then(res => res.blob())

            formData.append('file', blob)
        
            let response = await fetch('/api/login/face-access-token', {
                method: 'POST',
                body: formData
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
        this.setState({processing: false})
    }
    
    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (_state,_callback)=>{
            return;
        };
    }
    
    render() {
        if (UserStorage.isLoggedIn()) {
            return <Redirect to='/'/>
        }
        return (
            <Container className="mt-3">
                <Row>
                    <Col className="w-50 mx-auto">
                        <WebcamCapture ref={this.webcamPicture} />
                        { this.state.showError ?
                            <p className="text-danger">{this.state.errorText}</p> : null}
                        <Button letiant="primary" onClick={this.onLogin} disabled={this.state.processing === true}>
                            Login
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default FaceLogin;
