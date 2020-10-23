
class UserStorage {
    
    login(token) {
        localStorage.setItem('token', token)
    }
    
    logout() {
        localStorage.removeItem('token')
    }
    
    isLoggedIn() {
        return localStorage.getItem('token') !== null
    }
    
    getToken() {
        return localStorage.getItem('token')
    }
    
}

export default new UserStorage();
