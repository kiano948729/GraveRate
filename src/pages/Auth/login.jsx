import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser, loginWithGoogle } from "../../firebase/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      await loginUser(email, password);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

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

        <button className="bg-white text-black p-3 rounded font-semibold">
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-zinc-700 p-3 rounded"
        >
          Continue with Google
        </button>

        <Link to="/register" className="text-sm text-zinc-400">
          No account? Register
        </Link>
      </form>
    </div>
  );
}

export default Login;
