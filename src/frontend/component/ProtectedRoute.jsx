import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setVerified(false);
        return;
      }

      try {
        const res = await fetch("https://jerseyjamtu.onrender.com/authen/users", {
          headers: { authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setVerified(false);
        } else {
          const data = await res.json();
          if (data.success === true) {
            setVerified(true);
          } else {
            localStorage.clear();
            setVerified(false);
          }
        }
      } catch (error) {
        console.error(error);
        setVerified(false);
      }
    };

    verify();
  }, []);

  if (verified === null) return <div>Loading...</div>;
  if (!verified) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
