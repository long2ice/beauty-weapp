import { PropsWithChildren } from "react";
import "./app.css";
import "./interceptor";

export default function App({ children }: PropsWithChildren<{}>) {
  return children;
}
