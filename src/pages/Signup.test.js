import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import * as auth from 'firebase/auth';

jest.mock('firebase/auth');

describe('Signup', () => {
  it('should create a new user when the form is submitted', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    auth.createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: '123' } });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('الإيميل'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('كلمة المرور'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('تسجيل'));

    await waitFor(() => {
      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'password');
    });

    expect(alertMock).toHaveBeenCalledWith('تم إنشاء الحساب بنجاح');
  });
});
