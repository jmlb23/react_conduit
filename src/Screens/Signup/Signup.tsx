import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "react-redux";
import { Link } from "react-router-dom";
import { apiClient } from "../../data/Api";
import { isOther } from "../../data/Error";
import { AppActions } from "../../State/ActionCreators";
import { AppState } from "../../State/Reducers";
import "./Signup.css"

type SignupProps = {

};

export function Signup(props: SignupProps) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submited, setSubmited] = useState<string[]>([]);
  const store = useStore<AppState, AppActions>()
  const dispatch = useMemo(() => store.dispatch, [store.dispatch])

  useEffect(() => {
    if (submited.length === 5) {
      const [username, email, password, confirmPassword] = submited;
      if (password === confirmPassword)
        apiClient.addUser({ username: username, email: email, password: password }).then(x => isOther(x) ? (() => { dispatch({ type: "ADD_TOKEN", payload: x.token }); return x })() : x)
    }
  }, [dispatch, submited]);

  return (
    <div className="Signup__container">
      <h1>Sign up</h1>
      <Link to="/signin">Have an account?</Link>
      <div className="Signup__div">
        <input type="text" placeholder="Username" onInput={data => setUsername((data.target as HTMLInputElement).value)} />
        <input type="text" placeholder="Email" onInput={data => setEmail((data.target as HTMLInputElement).value)} />
        <input type="password" placeholder="Password" onInput={data => setPassword((data.target as HTMLInputElement).value)} />
        <input type="password" placeholder="Repeat Password" onInput={data => setConfirmPassword((data.target as HTMLInputElement).value)} />
        <button onClick={(_) => setSubmited([username, email, password, confirmPassword])}>Sign up</button>
      </div>
    </div>
  );
}
