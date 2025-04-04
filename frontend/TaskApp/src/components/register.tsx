import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import UserRegister from '/Users/benjaminhosseini/Desktop/React/FullStackProjects/TaskManagementApp/frontend/TaskApp/src/api/registeApi.ts';


function Register(){
    const [name, setName] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    // work on .then 
    function handleRegister() {
        UserRegister(name, lastname, email, password).then(() => {
            navigate('/');
        }).catch(() => {
            setError("Registration failed. Try again.");
        });
    }


    return(
        <div>
            <h1>Create Account</h1>
            <div>
            <input className='login-input' type="text" placeholder="First Name" value={name}
             onChange={(e) => setName(e.target.value)} />
            <input className='login-input' type="text" placeholder="Last Name" value={lastname} 
             onChange={(e) => setLastname(e.target.value)} />
            <input className='login-input' type="text" placeholder="Email Address" value={email} 
             onChange={(e) => setEmail(e.target.value)} />
            <input className='login-input' type="password" placeholder="Password" value={password} 
             onChange={(e) => setPassword(e.target.value)} />
            <button className="registerButton" onClick={handleRegister} >Submit</button>
            </div>
        </div>
    );
}

export default Register;