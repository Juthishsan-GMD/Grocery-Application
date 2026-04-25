import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function SellerProtectedRoute({ children }) {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const isOnboardingRoute = location.pathname.includes("/seller/onboarding");

    // TEMPORARY BYPASS FOR TESTING: allow direct access to onboarding page without login
    if (isOnboardingRoute) {
      setReady(true);
      return;
    }

    const isLocalLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isLocalSeller = localStorage.getItem("isSeller") === "true";
    const user = currentUser || (isLocalLoggedIn ? JSON.parse(localStorage.getItem("current_user") || "null") : null);

    if (!isLocalLoggedIn && !user) {
      navigate("/seller/auth", { replace: true });
      return;
    }

    if (!isLocalSeller && user?.role !== 'seller') {
      navigate("/", { replace: true });
      return;
    }

    const onboardingDone = localStorage.getItem("fb_onboarding_done") === "true";

    if (!onboardingDone && !isOnboardingRoute) {
      navigate("/seller/onboarding", { replace: true });
    } else if (onboardingDone && isOnboardingRoute) {
      navigate("/seller/dashboard", { replace: true });
    } else {
      setReady(true);
    }
  }, [currentUser, authLoading, navigate, location]);

  if (authLoading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return children;
}
