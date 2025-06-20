import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { UAParser } from 'ua-parser-js';
import "./Auth.css"
import icon from '../../assets/icon.png'
import Aboutauth from './Aboutauth'
import { signup, login } from '../../action/auth'

const Auth = () => {
    const [issignup, setissignup] = useState(false)
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Optional: Get user IP address
    const getIp = async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch {
            return "";
        }
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (!email && !password) {
            alert("Enter email and password")
            return;
        }
        const parser = new UAParser();
        const browser = parser.getBrowser().name;
        const os = parser.getOS().name;
        const device = parser.getDevice().type || "desktop";
        const ip = await getIp();

        if (issignup) {
            if (!name) {
                alert("Enter a name to continue")
                return;
            }
            dispatch(signup({ name, email, password, browser, os, device, ip }, navigate))
        } else {
            dispatch(login({ email, password, browser, os, device, ip }, navigate))
        }
    }

    const handleswitch = () => {
        setissignup(!issignup);
        setname("");
        setemail("");
        setpassword("")
    }

    return (
                <section className="auth-section">
            {issignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className='login-logo' />
                <form onSubmit={handlesubmit}>
                    {issignup && (
                        <label htmlFor="name">
                            <h4>Display Name</h4>
                            <input type="text" id='name' name='name' value={name} onChange={(e) => {
                                setname(e.target.value);
                            }} />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input type="email" id='email' name='email' value={email} onChange={(e) => {
                            setemail(e.target.value);
                        }} />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>Password</h4>
                            {!issignup && (
                                <p style={{ color: "#007ac6", fontSize: "13px" }}>
                                    Forgot Password?
                                </p>
                            )}
                        </div>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => {
                            setpassword(e.target.value)
                        }} />
                    </label>
                    <button type='submit' className='auth-btn' >
                        {issignup ? "Sign up" : "Log in"}
                    </button>
                </form>
                <p>
                    {issignup ? "Already have an account?" : "Don't have an account"}
                    <button type='button' className='handle-switch-btn' onClick={handleswitch}>
                        {issignup ? "Log in" : "Sign up"}
                    </button>
                </p>
            </div>
        </section>
    )
}

export default Auth
        