import { observer } from "mobx-react-lite";
import React, { Fragment, useContext, useEffect } from "react";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import { Container } from "semantic-ui-react";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import { HomePage } from "../../features/home/HomePage";
import NavBar from "../../features/nav/NavBar";
import ActivityStore from "../stores/activityStore";
import { LoadingComponent } from "./LoadingComponent";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  //#region states

  const activityStore = useContext(ActivityStore);

  //#endregion

  /**
   * useEffect Вызывается всякий раз когда компонент рендерится
   * второй параметр (в случае если это пустой массив) для того что бы вызов происходил только один раз - по сути это аналогаично вызову componentDidMount
   */

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content={"Loading activities..."} />;

  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/activities" component={ActivityDashBoard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
