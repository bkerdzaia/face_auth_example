import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login'

test('if renders login page', () => {
    const { getByText } = render(
        <Router>
            <Route>
                <Login />
            </Route>
        </Router>
    )
    const button = getByText(/Login$/i)
    expect(button).toBeInTheDocument()
});
