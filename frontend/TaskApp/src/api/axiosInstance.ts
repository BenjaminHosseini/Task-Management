import axios from "axios";

// creating an instance of axios for implementing
// sending user back to log in after token expires
const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export default api;