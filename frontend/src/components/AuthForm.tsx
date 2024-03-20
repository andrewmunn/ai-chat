import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError, isAxiosError } from 'axios';

const AuthForm: React.FC = () => {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await api.post('/user/login', {
                email: loginEmail,
                password: loginPassword,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            if (isAxiosError(error)) {
                setLoginError(axiosError.response.data.error);
            } else {
                setLoginError('An unknown error occurred');
            }
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError('');
        try {
            const response = await api.post('user/signup', {
                email: signupEmail,
                password: signupPassword,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Signup failed:', error);
            if (isAxiosError(error)) {
                setSignupError(error.response.data.error);
            } else {
                setSignupError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login or Signup</h2>
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Login</h3>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="loginEmail" className="block mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="loginEmail"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder='Sup'
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="loginPassword" className="block mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="loginPassword"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Login
                        </button>
                    </form>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Signup</h3>
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label htmlFor="signupEmail" className="block mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="signupEmail"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="signupPassword" className="block mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="signupPassword"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        {signupError && <p className="text-red-500 mb-4">{signupError}</p>}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Signup
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;