import React from 'react';

import { Form, Button } from 'react-bootstrap';
import { WebcamCapture } from './components/WebcamCapture';
import UserStorage from './storage/UserStorate';


class Account extends React.Component {
    
    constructor(props) {
        super(props)
        
        this.webcamPicture = React.createRef()
        this.state = {
            useFaceDetectionChecked: false,
            errorText: '',
            showError: false,
            processing: false,
            successText: '',
            showSuccess: false
        }
        this.handleFaceDetectionChange = this.handleFaceDetectionChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    
    handleFaceDetectionChange() {
        this.setState({
            useFaceDetectionChecked: !this.state.useFaceDetectionChecked
        })
    }
    
    async onSubmit(event) {
        event.preventDefault()
        this.setState({processing: true})
        try {
        
            let formData = new FormData()
            let imgUrl = this.webcamPicture.current.getScreenshot()
            
            let blob = await fetch(imgUrl).then(res => res.blob())

            formData.append('file', blob)
        
            let response = await fetch('/api/users/face/', {
                method: 'PUT',
                headers: {
                     'Authorization': `Bearer ${UserStorage.getToken()}`
                },
                body: formData
            })
        
            let result = await response.json()
            
            if (!result.success) {
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
                this.setState(
                    { successText: 'Image Successfully Saved.', showSuccess: true}
                )
            }
        
        } catch (e) {
            console.error(e);
        }
        this.setState({processing: false})
    }
    
    render() {
        if (UserStorage.isLoggedIn()) {
            return (
                <Form className="text-left m-3" onSubmit={this.onSubmit}>
                    <Form.Group controlId="formAccountCheckbox">
                        <Form.Check
                            type="checkbox"
                            label="Use face detection"
                            checked={ this.state.useFaceDetectionChecked }
                            onChange = { this.handleFaceDetectionChange } />
                        { this.state.showSuccess ?
                        <Form.Text className="text-success">
                            {this.state.successText}
                        </Form.Text> : null}
                        { this.state.showError ?
                        <Form.Text className="text-danger">
                            {this.state.errorText}
                        </Form.Text> : null}
                    </Form.Group>
                    { this.state.useFaceDetectionChecked ? [
                    <WebcamCapture ref={this.webcamPicture} key="wecamPicture"/>,
                    <Button variant="primary" type="submit" key="savebutton" disabled={this.state.processing === true}>
                        Save
                    </Button>
                    ] : null }
                </Form>
            );
        }
        return (
            <p>This is home page.</p>
        );
    }
}

export default Account;
