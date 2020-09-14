import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { createBrowserHistory } from 'history';
import "./app/layout/styles.css";
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-widgets/dist/css/react-widgets.css'
import App from "./app/layout/App";
import * as serviceWorker from "./serviceWorker";
import ScrollToTop from "./app/layout/ScrollToTop";
import dateFnsLocalizer from 'react-widgets-date-fns'; // При импорте возникает ошибка. Решается декларацией модуля в отдельном файле (react-widgets-date-fns.d.ts в нашем случае)

dateFnsLocalizer(); // https://jquense.github.io/react-widgets/localization/

// Мы используем свою history для того, что бы мы могли осуществлять навигацию в agent.tsx
// Это решает проблему пробрасывания исключения, возникшего в agent.tsx, дальше в компоненты для отображения окна с ошибкой
export const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
