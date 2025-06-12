import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(""); // New state for email error
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://book-memory.onrender.com/users/add", {
        name,
        email,
        password,
      });
      alert("Signup successful! Please log in.");
      navigate("/"); // Redirect to login
    } catch (err) {
      // console.log(err?.response?.data?.error);

      setError(err?.response?.data?.error);
      setTimeout(() => setError(""), 4000);
      // alert("Signup failed.");
    }
  };

  function handleKeyDown(e, field) {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submission on Enter
      switch (field) {
        case "name":
          if (name.trim().length > 1) emailRef.current.focus();
          break;
        case "email":
          // Validate email format
          if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Invalid email format"); // Set error message for invalid email
            setTimeout(() => setEmailError(""), 3000); // Clear the error after 3 seconds
          } else {
            setEmailError(""); // Clear error if email is valid
            passwordRef.current.focus();
          }
          break;
        case "password":
          if (password.length >= 6) handleSignup(e); // Submit if password is good
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-white mb-8">BookBuddy - Signup</h1>
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            ref={nameRef}
            onKeyDown={(e) => handleKeyDown(e, "name")}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            ref={emailRef}
            onKeyDown={(e) => handleKeyDown(e, "email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          {/* Show email error message */}
          {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            ref={passwordRef}
            onKeyDown={(e) => handleKeyDown(e, "password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Sign Up
        </button>

        {error && (
          <p className="text-red-600 text-sm text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}

export default Signup;
