import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Account from './Account'
import UserStorage from './storage/UserStorate'

test('if renders home page when user not logged in', () => {
  const { getByText } = render(<Account />)
  const linkElement = getByText(/This is home page/i)
  expect(linkElement).toBeInTheDocument()
});

test('if renders checkbox when user logged in', () => {
    jest.mock('./storage/UserStorate', () => jest.fn())
    UserStorage.isLoggedIn = jest.fn(
        () => {return true}
    )

    render(<Account />)
    const checkbox = screen.getByLabelText(/Use face detection/i)
    userEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
    const button = screen.getByText('Save')
    expect(button).toBeInTheDocument()
})
