import { useState } from "react";
import { useAuthContext, useNotifierContext } from "../../providers";
import axios from "axios";

//Styles
import "./style.scss";

//Assets
// @ts-ignore
import LockImage from "../../assets/img/lock.svg";
// @ts-ignore
import ProfileImage from "../../assets/img/profile.svg";

const LoginForm = () => {
  const { setIsLoggedIn } = useAuthContext();
  const { setNotifiers } = useNotifierContext();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      let response = await axios.post("/api/users/login/admin", { user, password });
      let data = await response.data;

      if (!data.status) {
        return setNotifiers({ errors: data.errors });
      }

      setNotifiers({ success: data.messages });
      setIsLoggedIn(true);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="head">
          <h2>تسجيل الدخول</h2>
        </div>
        <form method="POST" onSubmit={(e) => e.preventDefault()}>
          <div className="content">
            <div className="input-items">
              <div className="input-item">
                <img src={ProfileImage} alt="user" />
                <input
                  type="text"
                  name="user"
                  placeholder="اسم المستخدم أو البريد الالكتروني"
                  required
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div className="input-item">
                <img src={LockImage} alt="Lock" />
                <input
                  type="password"
                  name="pass"
                  placeholder="كلمة المرور"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input-item">
                <button
                  className="btn-login"
                  type="submit"
                  onClick={() => login()}
                >
                  تسجيل الدخول
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
