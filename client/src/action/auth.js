import * as api from "../api";
import { setcurrentuser } from "./currentuser";

// Signup action
export const signup = (authdata, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signup(authdata);
        dispatch({ type: "AUTH", data });
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
        navigate("/");
    } catch (error) {
        console.log(error);
        alert("Signup failed. Please try again.");
    }
};

// Helpers for login
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let browser = "Unknown";
    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edge") === -1) browser = "Chrome";
    else if (userAgent.indexOf("Edg") > -1 || userAgent.indexOf("Edge") > -1) browser = "Edge";
    else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) browser = "IE";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";

    let os = "Unknown";
    if (userAgent.indexOf("Win") > -1) os = "Windows";
    else if (userAgent.indexOf("Mac") > -1) os = "MacOS";
    else if (userAgent.indexOf("Linux") > -1) os = "Linux";
    else if (userAgent.indexOf("Android") > -1) os = "Android";
    else if (userAgent.indexOf("like Mac") > -1) os = "iOS";

    const isMobile = /Mobi|Android/i.test(userAgent);

    return { browser, os, isMobile };
}

async function getIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch {
        return "Unknown";
    }
}

// Login action
export const login = (authdata, navigate) => async (dispatch) => {
    try {
        const { browser, os, isMobile } = getDeviceInfo();
        const ip = await getIP();
        const device = isMobile ? "Mobile" : "Desktop";

        // Mobile: Only allow login between 10 AM and 1 PM
        if (isMobile) {
            const hour = new Date().getHours();
            if (hour < 10 || hour >= 13) {
                alert("Mobile login allowed only between 10 AM and 1 PM.");
                return;
            }
        }

        // Chrome: Require OTP
        if (browser === "Chrome") {
            await api.sendOtp({ email: authdata.email, browser, os, device, ip });
            const userOtp = prompt("Enter the OTP sent to your email:");
            const otpRes = await api.verifyOtp({ email: authdata.email, otp: userOtp });
            if (!otpRes.data.success) {
                alert("Invalid OTP");
                return;
            }
        }

        // Edge/IE: Allow login without OTP

        // Send device info to backend for login and history
        const { data } = await api.login({ ...authdata, browser, os, device, ip });
        dispatch({ type: "AUTH", data });
        dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
        navigate("/");
    } catch (error) {
        console.log(error);
        alert("Login failed. Please try again.");
    }
};