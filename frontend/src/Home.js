import React from 'react';

import UserStorage from './storage/UserStorate';


class Home extends React.Component {
    
    state = { user: { name: '' } }
    
    fetchUser() {
        fetch('/api/users/me/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${UserStorage.getToken()}`
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({user: responseJson})
            })
            .catch((error) => {
                console.error(error)
            })
    }
    
    componentDidMount() {
        if (UserStorage.isLoggedIn()) {
            this.fetchUser()
        }
    }
    
    render() {
        if (UserStorage.isLoggedIn()) {
            return (
                <p>My name is {this.state.user.name}</p>
            );
        }
        return (
            <p>This is home page.</p>
        );
    }
}

export default Home;
