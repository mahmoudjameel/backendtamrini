import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useAuthContext, useNotifierContext } from "./providers";

//Style
import "./style.scss";

//Screens
import {
  Login,
  Stats,
  Users,
  Articles,
  ImageExercises,
  VideoExercises,
  Halls,
  Products,
  Orders,
  Proteins,
  PaymentMethods,
  TermsOfServices,
  PrivacyPolicy,
  ProductsCategory,
  ImageExercisesCategory,
  VideoExercisesCategory,
  Advertisements,
  Nutritions,
  Home,
  ProteinCategory,
  Diets,
  Barcodes,
  Notifications,
  Questions,
  HomeExercisesCategory,
  HomeExercises,
} from "./screens";

//Components
import { Notifier, Header } from "./components";

const App = () => {
  const { isLoggedIn } = useAuthContext();
  const { isNotifierVisible } = useNotifierContext();

  return (
    <div className="App">
      {isNotifierVisible && <Notifier />}
      <Router>
        {isLoggedIn ? (
          <>
            <Header />
            <Switch>
              <Route path="/admin/stats" component={Stats} />
              <Route path="/admin/users" component={Users} />
              <Route path="/admin/articles" component={Articles} />
              <Route path="/admin/diets" component={Diets} />
              <Route path="/admin/questions" component={Questions} />
              <Route
                path="/admin/home-exercises-category"
                component={HomeExercisesCategory}
              />

              <Route path="/admin/home-exercises" component={HomeExercises} />
              <Route path="/admin/notifications" component={Notifications} />
              <Route path="/admin/barcodes" component={Barcodes} />
              <Route path="/admin/image-exercises" component={ImageExercises} />
              <Route path="/admin/video-exercises" component={VideoExercises} />
              <Route path="/admin/halls" component={Halls} />
              <Route path="/admin/products" component={Products} />
              <Route
                path="/admin/products-category"
                component={ProductsCategory}
              />
              <Route
                path="/admin/image-exercises-category"
                component={ImageExercisesCategory}
              />
              {/*<Route path="/admin/video-exercises-category" component={VideoExercisesCategory} />*/}
              <Route path="/admin/orders" component={Orders} />
              <Route path="/admin/proteins" component={Proteins} />
              <Route path="/admin/payment-methods" component={PaymentMethods} />
              <Route path="/admin/advertisements" component={Advertisements} />
              <Route path="/admin/nutritions" component={Nutritions} />
              <Route
                path="/admin/protein-category"
                component={ProteinCategory}
              />
              <Redirect to="/admin/stats" />
            </Switch>
          </>
        ) : (
          <Switch>
            {/* <Route exact path="/" component={Home} /> */}
            <Route path="/dash-log" component={Login} />
            <Route path="/terms-of-services" component={TermsOfServices} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Redirect to="/dash-log" />
          </Switch>
        )}
      </Router>
    </div>
  );
};

export default App;
