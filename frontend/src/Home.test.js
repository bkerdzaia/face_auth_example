import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from './Home'
import UserStorage from './storage/UserStorate'

test('if renders home page when user not logged in', () => {
    const { getByText } = render(<Home />)
    const element = getByText(/This is home page/i)
    expect(element).toBeInTheDocument()
});

test('if renders name when user logged in', () => {
    jest.mock('./storage/UserStorate', () => jest.fn())
    UserStorage.isLoggedIn = jest.fn(
        () => {return true}
    )
    render(<Home />)
    const text = screen.getByText('My name is')
    expect(text).toBeInTheDocument()
})
