import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000"
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem("Profile")) {
        req.headers.Authorization = `Bearer ${
            JSON.parse(localStorage.getItem("Profile")).token
        }`;
    }
    return req;
});

// Auth endpoints
export const signup = (authdata) => API.post("/auth/signup", authdata);
export const login = (authdata) => API.post("/auth/login", authdata);

// OTP endpoints
export const sendOtp = (payload) => API.post("/auth/send-otp", payload);
export const verifyOtp = (payload) => API.post("/auth/verify-otp", payload);

// Login history endpoint
export const getLoginHistory = (userId) => API.get(`/user/login-history/${userId}`);

// User endpoints
export const getallusers = () => API.get("/user/getallusers");
export const updateprofile = (id, updatedata) => API.patch(`/user/update/${id}`, updatedata);

// Question endpoints
export const postquestion = (questiondata) => API.post("/questions/Ask", questiondata);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) => API.patch(`/questions/vote/${id}`, { value });

// Answer endpoints
export const postanswer = (id, noofanswers, answerbody, useranswered, userid) =>
    API.patch(`/answer/post/${id}`, { noofanswers, answerbody, useranswered, userid });
export const deleteanswer = (id, answerid, noofanswers) =>
    API.patch(`/answer/delete/${id}`, { answerid, noofanswers });