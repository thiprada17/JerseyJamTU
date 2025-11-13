import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [verified, setVerified] = useState(null); // null = loading, true/false = verified
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          setVerified(false);
          return;
        }

        const authen = await fetch('https://jerseyjamtu.onrender.com/authen/users', {
          method: 'GET',
          headers: { authorization: `Bearer ${authToken}` }
        });

        if (!authen.ok) {
          console.error('authen fail', authen.status);
          setVerified(false);
          return;
        }

        const authenData = await authen.json();

        // ตรวจสอบความสำเร็จของ token
        if (!authenData || !authenData.data || !authenData.data.success) {
          localStorage.clear();
          setVerified(false);
          return;
        }

        setVerified(true);
      } catch (error) {
        console.error('verify error:', error);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) {
    // แสดง loading ระหว่าง verify token
    return <div>Loading...</div>;
  }

  if (!verified) {
    // ถ้าไม่ผ่าน token → redirect ไปหน้า login
    return <Navigate to="/" replace />;
  }

  // ถ้า verified → render children
  return children;
}

export default ProtectedRoute;
