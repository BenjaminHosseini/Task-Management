import axios from "axios";

const REGISTER_API_URL = "http://127.0.0.1:8000/users";

function UserRegister(name: string, lastname: string, email: string, password: string){
    return axios.post(REGISTER_API_URL, {
        name,
        lastname,
        email,
        password
    });   
}

export default UserRegister;