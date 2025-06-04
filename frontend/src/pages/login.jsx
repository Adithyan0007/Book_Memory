import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();

  // Autofocus on email input on mount
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleLogin = async () => {
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/users/login", {
        email,
        password,
      });

      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "email") {
        passwordRef.current.focus();
      } else if (field === "password") {
        handleLogin();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            ref={emailRef}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "email")}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            ref={passwordRef}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "password")}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
