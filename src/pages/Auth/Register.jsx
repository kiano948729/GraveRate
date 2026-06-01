import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser, loginWithGoogle } from "../../firebase/auth";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");

      await registerUser(username, email, password);

      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;

        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;

        case "auth/invalid-email":
          setError("Invalid email address");
          break;

        default:
          setError("Something went wrong");
      }
    }
  }

  async function handleGoogleRegister() {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;

        case "auth/weak-password":
          setError("Password must be at least 6 characters");
          break;

        case "auth/invalid-email":
          setError("Invalid email address");
          break;

        default:
          setError("Something went wrong");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">Register</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 rounded bg-zinc-800"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded bg-zinc-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded bg-zinc-800"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 rounded bg-zinc-800"
        />

        <button className="bg-white text-black p-3 rounded font-semibold">
          Register
        </button>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="bg-zinc-700 p-3 rounded"
        >
          Continue with Google
        </button>

        <Link to="/login" className="text-sm text-zinc-400">
          Already have an account?
        </Link>
      </form>
    </div>
  );
}

  export default Register;
