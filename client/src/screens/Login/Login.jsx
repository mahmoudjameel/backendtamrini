import { Redirect } from "react-router-dom";
import { useAuthContext } from "../../providers";

//Components
import { LoginForm } from "../../components";
import { Helmet } from "react-helmet";

const Login = () => {
  const { isLoggedIn } = useAuthContext();

  return (
    <>
      <Helmet>
        <title>تمريني / تسجيل الدخول</title> 
      </Helmet>
      <div>
        {isLoggedIn && <Redirect to="/admin/stats" />}
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
