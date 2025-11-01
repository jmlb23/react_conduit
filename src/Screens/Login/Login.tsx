import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "react-redux";
import { Link } from "react-router-dom";
import { apiClient } from "../../data/Api";
import { isOther } from "../../data/Error";
import { AppActions } from "../../State/ActionCreators";
import { AppState } from "../../State/Reducers";
import "./Login.css"


type LoginProps = {

};


export function Login(props: LoginProps) {
  const [emailI, setEmailI] = useState("");
  const [passwordI, setPasswordI] = useState("");
  const [submited, setSubmited] = useState<string[]>([]);
  const store = useStore<AppState, AppActions>()
  const dispatch = useMemo(() => store.dispatch, [store.dispatch])


  useEffect(() => {
    if (submited.length > 0) {
      const [em, pass] = submited;
      apiClient.login({ email: em, password: pass }).then(x => isOther(x) ? (() => { dispatch({ type: "ADD_TOKEN", payload: x.token }); return x })() : x)
    }
  }, [dispatch, submited]);

  return (
    <div className="Login__container">
      <h1 className="Login_h1">Sign in</h1>
      <Link className="Login_link" to="/signup">Need an account?</Link>
      <div className="Login__form">
        <input className="Login_form__input" type="text" placeholder="Email" onInput={data => setEmailI((data.target as HTMLInputElement).value)} />
        <input className="Login_form__input" type="password" placeholder="Password" onInput={x => setPasswordI((x.target as HTMLInputElement).value)} />
        <button onClick={_ => setSubmited([emailI, passwordI])}>Sign in</button>
      </div>
    </div>
  );
}
