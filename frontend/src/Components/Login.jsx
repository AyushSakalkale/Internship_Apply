import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {userId: sessionId},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      //console.log(response);
      if (response.data.success) {
        navigate("/otp");
      }
    } catch (err) {
      setError(true);
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="text-center p-6 bg-white shadow-md rounded-md w-80">
      <h2 className="text-2xl font-bold mb-4">Session Login</h2>
      <input
        type="text"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Enter Session ID"
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
      >
        Enter
      </button>

      {error && (
        <p className="mt-4 text-red-500">
          Invalid session ID. Please try again.
        </p>
      )}
    </div>
  );
};

export default Login;
