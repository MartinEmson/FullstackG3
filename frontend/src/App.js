import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ChatRoom from './pages/ChatRoom';
import NoPage from './pages/NoPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const userId = isLoggedIn ? sessionStorage.getItem('userId') : null;
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('isLoggedIn');
        navigate('/login');
    };

    console.log("Current userId:", userId); // Added console log

    return (
        <>
            <ul className='nav'>
                <li>
                    <Link to={'/'}>Hem</Link>
                </li>
                {!isLoggedIn && (
                    <>
                        <li>
                            <Link to={'/signup'}>Registrering</Link>
                        </li>
                        <li>
                            <Link to={'/login'}>Logga In</Link>
                        </li>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <li>
                            <Link to={`/messages/${userId}`}>Meddelanden</Link>
                        </li>
                        <li>
                            <Link to={`/profile/${userId}`}>Profil</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout}>Logga ut</button>
                        </li>
                    </>
                )}
            </ul>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NoPage />} />
                <Route path="/messages/:id" element={<ChatRoom />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </>
    );
}

export default App;
