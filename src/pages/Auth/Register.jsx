import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginWithGoogle } from "../../firebase/auth";

function getAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email al in gebruik";
    case "auth/weak-password":
      return "Wachtwoord moet minimaal 6 tekens zijn";
    case "auth/invalid-email":
      return "Ongeldig e-mailadres";
    default:
      return "Er is iets misgegaan";
  }
}

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
      return setError("Wachtwoorden komen niet overeen");
    }

    try {
      setError("");
      await registerUser(username, email, password);
      navigate("/");
    } catch (err) {
      setError(getAuthError(err.code));
    }
  }

  async function handleGoogleRegister() {
    try {
      setError("");
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(getAuthError(err.code));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">Registreren</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Gebruikersnaam"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 rounded bg-zinc-800"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded bg-zinc-800"
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded bg-zinc-800"
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord bevestigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 rounded bg-zinc-800"
          required
        />

        <button
          type="submit"
          className="bg-white text-black p-3 rounded font-semibold"
        >
          Registreren
        </button>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="bg-zinc-700 p-3 rounded"
        >
          Doorgaan met Google
        </button>

        <Link to="/login" className="text-sm text-zinc-400">
          Al een account? Inloggen
        </Link>
      </form>
    </div>
  );
}

export default Register;
