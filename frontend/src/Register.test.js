import React from 'react'
import { render } from '@testing-library/react'
import Register from './Register'

test('if renders register page', () => {
    const { getByText, getByLabelText } = render(<Register />)
    const usernameElement = getByLabelText(/Username/i)
    expect(usernameElement).toBeInTheDocument()
    const passwordElement = getByLabelText(/Password/i)
    expect(passwordElement).toBeInTheDocument()
    const button = getByText(/Register/i)
    expect(button).toBeInTheDocument()
});
