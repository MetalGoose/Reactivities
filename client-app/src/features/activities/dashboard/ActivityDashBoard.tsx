import React, { useEffect, useContext } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityStore from '../../../app/stores/activityStore'

export const ActivityDashBoard: React.FC = () => {
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
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashBoard);
