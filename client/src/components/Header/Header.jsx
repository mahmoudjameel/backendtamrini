import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthContext, useNotifierContext } from "../../providers";

//Style
import "./style.scss";

//Assets
//@ts-ignore
import UserIcon from "../../assets/img/user.svg";
//@ts-ignore
import SettingsIcon from "../../assets/img/settings.png";
//@ts-ignore
import GraphicIcon from "../../assets/img/graphic.svg";
//@ts-ignore
import BossIcon from "../../assets/img/boss.svg";
//@ts-ignore
import Logo from "../../assets/img/logo.png";

const Header = () => {
  const { pathname } = useLocation();
  const { setIsLoggedIn } = useAuthContext();
  const { setNotifiers } = useNotifierContext();
  const [user, setUser] = useState(Cookies.getJSON("user_data"));
  const [passwordObj, setPasswordObj] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [sidebarActive, setSidebarActive] = useState(false);
  const [floatingBoxActive, setFloatingBoxActive] = useState(false);
  const [settingsBoxActive, setSettingsBoxActive] = useState(false);
  const sidebarRef = useRef(null);
  const floatingBoxRef = useRef(null);
  const settingsBoxRef = useRef(null);

  useEffect(() => {
    window.addEventListener("mouseup", containerHandler);

    return () => {
      window.removeEventListener("mouseup", containerHandler);
    };
  }, []);

  const containerHandler = (e) => {
    e.preventDefault();

    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSidebarActive(false);
    }

    if (floatingBoxRef.current && !floatingBoxRef.current.contains(e.target)) {
      setFloatingBoxActive(false);
    }

    if (settingsBoxRef.current && !settingsBoxRef.current.contains(e.target)) {
      setSettingsBoxActive(false);
    }
  };

  const editUser = async () => {
    try {
      let response = await axios.post("/api/users/edit", {
        ...user,
        ...passwordObj,
      });
      let data = await response.data;

      if (!data.status) return setNotifiers({ errors: data.errors });

      setNotifiers({ success: data.messages });
      setUser(data.user);
      setPasswordObj({ password: "", passwordConfirm: "" });
      Cookies.set("user_data", JSON.stringify(data.user));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <header>
        <div
          className="burger-menu"
          onClick={() => setSidebarActive(!sidebarActive)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="left-items">
          <div className="user-info">
            <div className="user-img">
              <img src={UserIcon} alt="User" />
            </div>
            <div className="user-name">{user.name}</div>
          </div>
          <span></span>
          <div
            className="settings-icon"
            onClick={() => setFloatingBoxActive(!floatingBoxActive)}
          >
            <img src={SettingsIcon} alt="settings" />
          </div>
        </div>

        <div
          className="floating-box"
          ref={floatingBoxRef}
          style={{ display: floatingBoxActive ? "block" : "none" }}
        >
          <div>
            <button
              className="btn-settings"
              onClick={() => setSettingsBoxActive(true)}
            >
              اعدادت الحساب
            </button>
            <Link
              to="/"
              className="btn-logout"
              onClick={() => setIsLoggedIn(false)}
            >
              تسجيل الخروج
            </Link>
          </div>
        </div>
      </header>

      <aside
        className="sidebar"
        ref={sidebarRef}
        style={{ right: sidebarActive ? 0 : -300 }}
      >
        <div className="logo-container">
          <div className="logo">
            <img src={Logo} alt="Logo" />
          </div>
        </div>
        <div className="side-links">
          <Link
            to="/admin/stats"
            className={`link ${pathname.startsWith("/admin/stats") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={GraphicIcon} alt="icon" className="link-icon" />
            <h2>الإحصائيات</h2>
          </Link>
          <Link
            to="/admin/users"
            className={`link ${pathname.startsWith("/admin/users") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>المستخدمين</h2>
          </Link>
          <Link
            to="/admin/articles"
            className={`link ${pathname.startsWith("/admin/articles") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>المقالات</h2>
          </Link>
          {/* hna */}
          <Link
            to="/admin/diets"
            className={`link ${pathname.startsWith("/admin/articles") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>اكلات دايت</h2>
          </Link>


          <Link
            to="/admin/barcodes"
            className={`link ${pathname.startsWith("/admin/barcodes") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>البحث عن طريق الباركود</h2>
          </Link>


          <Link
            to="/admin/questions"
            className={`link ${pathname.startsWith("/admin/questions") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>الاسئله</h2>
          </Link>

          
          
          <Link
            to="/admin/home-exercises-category"
            className={`link ${pathname.startsWith("/admin/home-exercises-category") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >

            

            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>أقسام التمارين المنزليه</h2>
          </Link>

          
          <Link
            to="/admin/home-exercises"
            className={`link ${pathname.startsWith("/admin/home-exercises") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >

            

            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2> التمارين المنزليه</h2>
          </Link>


          {/* hta hna */}
          <Link
            to="/admin/video-exercises"
            className={`link ${pathname === "/admin/video-exercises" ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>قسم البحث عن تمرين</h2>
          </Link>
          <Link
            to="/admin/image-exercises"
            className={`link ${pathname === "/admin/image-exercises" ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>تمارين رياضية (صور)</h2>
          </Link>
          <Link
            to="/admin/halls"
            className={`link ${pathname.startsWith("/admin/halls") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>القاعات</h2>
          </Link>
          <Link
            to="/admin/products-category"
            className={`link ${pathname.startsWith("/admin/products-category") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>أقسام المتجر</h2>
          </Link>
          <Link
            to="/admin/image-exercises-category"
            className={`link ${pathname.startsWith("/admin/image-exercises-category") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>أقسام التمارين (صور)</h2>
          </Link>
          {/*<Link
            to="/admin/video-exercises-category"
            className={`link ${pathname.startsWith("/admin/video-exercises-category") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>أقسام التمارين (فيديو)</h2>
          </Link>*/}
          <Link
            to="/admin/products"
            className={`link ${pathname === "/admin/products" ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>المنتجات</h2>
          </Link>
          <Link
            to="/admin/protein-category"
            className={`link ${pathname.startsWith("/admin/protein-category") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>أقستم المكملات<br/>الغذائية</h2>
          </Link>
          <Link
            to="/admin/proteins"
            className={`link ${pathname.startsWith("/admin/proteins") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>البروتينات</h2>
          </Link>
          <Link
            to="/admin/orders"
            className={`link ${pathname.startsWith("/admin/orders") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>طلبات الشراء</h2>
          </Link>
          <Link
            to="/admin/nutritions"
            className={`link ${pathname.startsWith("/admin/nutritions") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>القيم الغذائية</h2>
          </Link>
          <Link
            to="/admin/payment-methods"
            className={`link ${pathname.startsWith("/admin/payment-methods") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>وسائل الدفع</h2>
          </Link>
          <Link
            to="/admin/advertisements"
            className={`link ${pathname.startsWith("/admin/advertisements") ? "active-link" : ""
              }`}
            onClick={() => setSidebarActive(false)}
          >
            <img src={BossIcon} alt="icon" className="link-icon" />
            <h2>الاعلانات</h2>
          </Link>
        </div>
      </aside>

      <div
        className="float-box-container"
        style={{ display: settingsBoxActive ? "flex" : "none" }}
      >
        <div className="settings-box" ref={settingsBoxRef}>
          <div className="closing" onClick={() => setSettingsBoxActive(false)}>
            <span></span>
            <span></span>
          </div>
          <form method="POST" onSubmit={(e) => e.preventDefault()}>
            <div className="input-items">
              <div className="input-item">
                <label>اسم المستخدم</label>
                <input
                  type="text"
                  name="username"
                  placeholder="اسم المستخدم"
                  defaultValue={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>
              <div className="input-item">
                <label>البريد الالكتروني</label>
                <input
                  type="text"
                  name="email"
                  placeholder="البريد الالكتروني"
                  defaultValue={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="input-item">
                <label>الاسم</label>
                <input
                  type="text"
                  name="name"
                  placeholder="الاسم"
                  defaultValue={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="input-item">
                <label>رقم الهاتف</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="رقم الهاتف"
                  defaultValue={user.phoneNumber}
                  onChange={(e) =>
                    setUser({ ...user, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="input-item">
                <button
                  className="save-btn"
                  type="submit"
                  onClick={() => editUser()}
                >
                  حفظ البيانات
                </button>
              </div>
            </div>
          </form>
          <span></span>
          <h3>تغيير كلمة المرور</h3>
          <form method="POST" onSubmit={(e) => e.preventDefault()}>
            <div className="input-items">
              <div className="input-item">
                <label>كلمة المرور الجديدة</label>
                <input
                  type="password"
                  name="pass1"
                  placeholder="كلمة المرور الجديدة"
                  value={passwordObj.password}
                  onChange={(e) =>
                    setPasswordObj({ ...passwordObj, password: e.target.value })
                  }
                />
              </div>
              <div className="input-item">
                <label>تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="pass2"
                  placeholder="تأكيد كلمة المرور"
                  value={passwordObj.passwordConfirm}
                  onChange={(e) =>
                    setPasswordObj({
                      ...passwordObj,
                      passwordConfirm: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input-item">
                <button
                  className="save-btn"
                  type="submit"
                  onClick={() => editUser()}
                >
                  تحديث كلمة المرور
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div
        className="box-container"
        style={{ display: "none" }}
        onClick={() => "this.style.display = 'none';"}
      ></div>
    </>
  );
};

export default Header;
