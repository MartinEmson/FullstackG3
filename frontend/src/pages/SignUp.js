import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const navigate = useNavigate();

    const handleSignup = () => {
        // Check if passwords match
        if (password !== repeatPassword) {
            alert("Passwords don't match");
            return;
        }

        // Make a POST request to the signup endpoint
        Axios.post('http://localhost:8900/users', {
            email: email,
            password: password
        })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    // Signup successful, navigate to the desired page
                    // You can replace '/profile' with the appropriate route
                    navigate('/profile');
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
            height: '100vh',
            width: '100%',
            background: 'linear-gradient(#FBBAA6 10%, #f30000a4)',
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
                <h1 style={styles.h1}>ChatITHS</h1>
                <input
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <p style={styles.loginText}>Already have an account?</p>
                    <p style={styles.linkText}>Login</p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
