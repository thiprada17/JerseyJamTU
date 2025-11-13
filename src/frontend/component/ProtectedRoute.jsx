import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [verified, setVerified] = useState(null); 

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setVerified(false);
        setLoading(false);
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
          if (!data?.data?.success) {
            localStorage.clear();
            setVerified(false);
          } else {
            setVerified(true);
          }
        }
      } catch (error) {
        console.error(error);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);


  if (!verified) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
