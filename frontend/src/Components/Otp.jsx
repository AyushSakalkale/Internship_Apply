import {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const OTPInput = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [successfull, setSuccessfull] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null); // State for session info

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/session",
          {
            withCredentials: true,
          }
        );
        setSessionInfo(response.data.session);
      } catch (err) {
        console.log("Failed to fetch session info:", err);
        setSessionInfo(null);
      }
    };

    fetchSessionInfo();
  }, []);

  useEffect(() => {
    if (otpGenerated && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, otpGenerated]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleGenerateOtp = async () => {
    setIsSubmitting(true);
    setError(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/otp/generate",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const myotp = response.data.otp;
        toast.success(`Testing OTP: ${myotp}`, {autoClose: 5000});
        setOtpGenerated(true);
        setOtpVerified(false);
        setTimer(10);
      }

      setOtp(["", "", "", ""]);
    } catch (err) {
      setError(true);
      setErrorData("Failed to generate OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsSubmitting(true);
    setError(false);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/otp/verify",
        {otp: otp.join("")},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setSuccessfull(true);
        setOtpVerified(true);
        setError(false);
      } else {
        setError(true);
        setErrorData("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError(true);
      setErrorData(err?.response?.data?.error || "Verification failed.");
    } finally {
      setIsSubmitting(false);
      setOtp(["", "", "", ""]);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3000/api/auth/logout",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/");
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <div className="text-center p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">OTP Verification System</h1>

      {sessionInfo && (
        <div className="text-gray-700 mb-4">
          <p>
            <strong>Session ID:</strong> {sessionInfo._id}
          </p>
          <p>
            <strong>User ID:</strong> {sessionInfo.userId}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="flex space-x-2 mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              className={`w-12 h-12 text-center text-xl border rounded-md ${
                error ? "border-red-500 animate-shake" : "border-gray-300"
              } focus:outline-none`}
            />
          ))}
        </div>
        <div className="flex space-x-6">
          <button
            onClick={handleGenerateOtp}
            disabled={isSubmitting || timer > 0 || otpVerified}
            className={`bg-green-500 text-white font-semibold py-2 px-4 rounded ${
              isSubmitting || timer > 0 || otpVerified
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-600"
            }`}
          >
            Generate OTP
          </button>

          <button
            onClick={handleVerifyOtp}
            disabled={
              isSubmitting || otp.includes("") || timer > 0 || !otpGenerated
            }
            className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded ${
              isSubmitting || otp.includes("") || timer > 0 || !otpGenerated
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            Verify
          </button>
        </div>
        {timer > 0 && (
          <p className="mt-3 text-gray-600">
            Please wait {timer} seconds before generating again.
          </p>
        )}
        {error && <p className="mt-2 text-red-500">{errorData}</p>}
        {otpGenerated && !successfull && (
          <p className="mt-2 text-green-500">OTP Generated Successfully</p>
        )}
        {successfull && (
          <p className="mt-2 text-green-400">Verified Successfully</p>
        )}

        <button onClick={handleLogout} className="mt-4 text-blue-600 underline">
          Logout
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
