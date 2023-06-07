import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AxiosInstance from './AxiosInstance';

const SignUp = () => {
    const [userFirstname, setUserFirstname] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSignup = () => {
        // Check if passwords match
        if (password !== repeatPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        AxiosInstance.post('/users', { user_firstname: userFirstname, password })
            .then((response) => {
                setIsLoading(false);
                if (response.status === 200) {
                    // Signup successful, extract user ID from the response
                    const userId = response.data.userId;

                    // Store the user ID in session storage
                    sessionStorage.setItem('userId', userId);
                    sessionStorage.setItem('isLoggedIn', 'true');

                    // Navigate to the profile page
                    navigate(`/profile/${userId}`);
                } else {
                    setError('Signup failed');
                }
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response && error.response.status === 409) {
                    setError('An account with the same username already exists');
                } else {
                    setError('An error occurred during signup');
                }
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
                {error && <p>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    style={styles.input}
                    value={userFirstname}
                    onChange={(e) => setUserFirstname(e.target.value)}
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
                <button onClick={handleSignup} style={styles.button} disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Signup'}
                </button>
                <div style={styles.loginLink}>
                    <p style={styles.loginText}>Already have an account?</p>
                    <Link to="/login" style={styles.linkText}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
