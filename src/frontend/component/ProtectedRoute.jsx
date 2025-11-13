import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [verified, setVerified] = useState(true); // assume token exist ถ้าเพิ่ง login
  const [loading, setLoading] = useState(false); // ไม่ต้อง block หน้า

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setVerified(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          "https://jerseyjamtu.onrender.com/authen/users",
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          setVerified(false);
          return;
        }
        const data = await res.json();
        if (!data?.data?.success) {
          localStorage.clear();
          setVerified(false);
          return;
        }
      } catch {
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (!verified) return <Navigate to="/" replace />;
  if (loading) return <div>Loading...</div>;

  return children;
}

export default ProtectedRoute;
