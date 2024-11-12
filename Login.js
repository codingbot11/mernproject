import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import userImage from '../../src/images/user.png';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { username, password } = loginInfo;
        if (!username || !password) {
            return handleError('username and password are required')
        }
        try {
            const url = `https://deploy-mern-app-1-api.vercel.app/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className='container'>
            <div className='heading'>
            <h1>Sign in</h1>
            </div>
          
          
            <form onSubmit={handleLogin}>
          
                <div>
                <img src={userImage} className='img' alt=""></img>
                   
                    <input
                        onChange={handleChange}
                        type='username'
                        name='username'
                        placeholder='Enter your username...'
                        value={loginInfo.username}
                    />
                </div>
                <div>
               
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
             
              <p className='forgot'><a href='#'>Forgot your password</a></p>
                <button type='submit'> <Link to="/signup" className='link'>Login</Link></button>
                
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login
