import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { AppState } from "../State/Reducers";

type GuardProps = { to: string }

type GuardPropsWithChildren = PropsWithChildren<GuardProps>
export const Guard = (props: GuardPropsWithChildren) => {
  const token = useSelector<AppState>((s) => s.token)
  return (
    token !== null ? props.children : <Redirect to={props.to} />
  )
}
