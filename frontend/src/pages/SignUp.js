import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
    const [user_firstname, setUserFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSignup = () => {
        // Check if passwords match
        if (password !== repeatPassword) {
            alert("Passwords don't match");
            return;
        }

        // Make a POST request to create a new user
        Axios.post('http://localhost:8900/users', {
            user_firstname: user_firstname,
            password: password
        })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    const { user_id, token } = response.data;
                    // Store the token and user ID in local storage
                    localStorage.setItem('token', token);
                    localStorage.setItem('loggedInUserId', user_id);
                    // Call the login function from AuthContext with the user ID
                    login(user_id); // Add this line
                    navigate('/');
                } else {
                    console.log('Signup failed');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };



    const styles = {
        body: {
            height: '80vh',
            width: '100%',
            margin: 0,
            padding: 0,
            fontFamily: 'Inter, sans-serif',
        },
        signupContainer: {
            height: '80%',
            width: '60%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '70px',
        },
        input: {
            width: '400px',
            height: '60px',
            border: 'none',
            outline: 'none',
            marginBottom: '20px',
            textIndent: '15px',
            borderRadius: '10px',
        },
        h1: {
            fontSize: '60px',
            marginBottom: '55px',
            color: 'white',
        },
        button: {
            backgroundColor: '#5883F2',
            width: '340px',
            height: '50px',
            borderRadius: '10px',
            border: 'none',
            color: 'white',
            marginBottom: '15px',
            marginTop: '10px',
            cursor: 'pointer',

        },
        loginLink: {
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginText: {
            marginRight: '5px',
            color: 'white',
        },
        linkText: {
            color: '#625FDE',
        },
    };

    return (
        <div style={styles.body}>
            <div style={styles.signupContainer}>
                <h1 style={styles.h1}>Signup</h1>
                <input
                    type="text"
                    placeholder="Username"
                    style={styles.input}
                    value={user_firstname}
                    onChange={(e) => setUserFirstName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Repeat Password"
                    style={styles.input}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <button onClick={handleSignup} style={styles.button}>
                    Signup
                </button>
                <div style={styles.loginLink}>
                    <p style={styles.loginText}>Har du redan ett konto?</p>
                    <Link to={'/login'} style={styles.linkText}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
