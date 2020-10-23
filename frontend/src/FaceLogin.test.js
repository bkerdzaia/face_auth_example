import React from 'react'
import { render } from '@testing-library/react'
import FaceLogin from './FaceLogin'

test('if renders face login page', () => {
  const { getByText } = render(<FaceLogin />)
  const button = getByText(/Login/i)
  expect(button).toBeInTheDocument()
});
