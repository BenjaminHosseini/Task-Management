import React, {useState} from 'react';
import UserLogin from '../api/authApi.ts';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login(){
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    function handleSubmit(){
        UserLogin(username, password).then((data) => {
            //nagigate only if user credential is valid using .then
            sessionStorage.setItem("token", data.access_token)
            sessionStorage.setItem("user_id", data.user.id)
            navigate('/todo');
        }).catch((err) => {
            console.error("Login failed, ", err);
            setError("Invalid credentials.")
        });
    }

    function handleSignUp(){
        navigate('/register');
    }

    return(
        <div className="login">
            <h1>Task Management</h1>
            <div>
            <input className="login-input" type="text"
             placeholder="Email address"
             value={username} 
             onChange={(e) => setUsername(e.target.value)}
            />
            <input className="login-input" type="text"
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button className="signUpButton" onClick={handleSignUp}>Sign Up</button>
            <button className="submitButton" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}
export default Login;