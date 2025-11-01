import { createRoot } from "react-dom/client";
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
// import { Footer } from './Common/Footer/Footer';
import { Header } from './Common/Header/Header';
import { Home } from './Screens/Home/Home';
import { Login } from './Screens/Login/Login';
import { NotFound } from './Screens/NotFound/NotFound';
import { UserProfile } from './Screens/Profile/Profile';
import { Signup } from './Screens/Signup/Signup';
import { AppStore } from './State/Store';
import { Article } from './Screens/Article/Article';
import { Editor } from './Screens/Editor/Editor';
import { UserSettings } from './Screens/UserSettings/UserSettings';
import { Guard } from './Common/Guard';

const root = createRoot(document.getElementById("root")!);

root.render(<Provider store={AppStore}>
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/articles/:id">
          <Article />
        </Route>
        <Route path="/editor">
          <Guard to="/signin">
            <Editor />
          </Guard>
        </Route>
        <Route path="/settings">
          <Guard to="/signin">
            <UserSettings />
          </Guard>
        </Route>
        <Route path="/profiles/:id/favorites">
          <UserProfile showFavs={true} />
        </Route>
        <Route exact path="/profiles/:id">
          <UserProfile showFavs={false} />
        </Route>
        <Route exact path="/signin">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      {/* <Footer /> */}
    </BrowserRouter>
  </React.StrictMode >
</Provider >);

reportWebVitals();
