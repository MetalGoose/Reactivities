import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import { observer } from "mobx-react-lite";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";

const App = () => {

  //#region states

  const activityStore = useContext(ActivityStore)

  //#endregion

  /**
   * useEffect Вызывается всякий раз когда компонент рендерится
   * второй параметр (в случае если это пустой массив) для того что бы вызов происходил только один раз - по сути это аналогаично вызову componentDidMount
   */ 
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content={"Loading activities..."}/>

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashBoard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
