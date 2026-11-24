import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

export default function SignupPage() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/signup", { username, email, password });
      const loginResponse = await api.post("/auth/login", { email, password });

      login(loginResponse.data.token, loginResponse.data.token);
      navigate("/boards");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Signup Failed!");
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Create Your Account</h1>
        <p>Start Boarding in a minute!</p>
        {error && <p>{error}</p>}
        <label>Username: </label>
        <input
          value={username}
          placeholder="Enter Username.."
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label>Email: </label>
        <input
          value={email}
          placeholder="Enter Email..."
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password: </label>
        <input
          value={password}
          placeholder="Enter Password.."
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account ? <Link to={"/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
}
