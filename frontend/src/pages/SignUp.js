import React from 'react';
import { injectGlobal } from 'styled-components';

const SignupPage = () => {
    const handleSignup = () => {
        // Implement signup logic here
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
                <input type="email" placeholder="Email" style={styles.input} />
                <input type="password" placeholder="Password" style={styles.input} />
                <input type="password" placeholder="Repeat Password" style={styles.input} />
                <button onClick={handleSignup} style={styles.button}>Signup</button>
                <div style={styles.loginLink}>
                    <p style={styles.loginText}>Already have an account?</p>
                    <p style={styles.linkText}>Login</p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
