import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from '../apiConfig';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (!storedTokens) return null;

    try {
      const parsedTokens = JSON.parse(storedTokens);
      return parsedTokens;
    } catch (error) {
      localStorage.removeItem("authTokens");
      return null;
    }
  });
  let [user, setUser] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    if (!storedTokens) return null;

    try {
      const parsedTokens = JSON.parse(storedTokens);
      return jwt_decode(parsedTokens.access);
    } catch (error) {
      localStorage.removeItem("authTokens");
      return null;
    }
  });
  let [loading, setLoading] = useState(true);
  let [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  let loginUser = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      let response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });
      let data = await response.json();

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate(from, { replace: true });
      } else {
        const detail = data?.detail || data?.non_field_errors?.[0] || "登入失敗，請確認帳號與密碼。";
        setLoginError(detail);
      }
    } catch (error) {
      setLoginError("無法連線到後端服務，請確認後端是否已啟動。");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/Login");
  };

  // let updateToken = async ()=> {

  //     let response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
  //         method:'POST',
  //         headers:{
  //             'Content-Type':'application/json'
  //         },
  //         body:JSON.stringify({'refresh':authTokens?.refresh})
  //     })

  //     let data = await response.json()

  //     if (response.status === 200){
  //         setAuthTokens(data)
  //         setUser(jwt_decode(data.access))
  //         localStorage.setItem('authTokens', JSON.stringify(data))
  //     }else{
  //         logoutUser()
  //     }

  //     if(loading){
  //         setLoading(false)
  //     }
  // }

  let contextData = {
    user: user,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    loginError: loginError,
    setLoginError: setLoginError,
  };

  useEffect(() => {
    if (authTokens?.access) {
      try {
        setUser(jwt_decode(authTokens.access));
      } catch (error) {
        setUser(null);
        setAuthTokens(null);
        localStorage.removeItem("authTokens");
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
