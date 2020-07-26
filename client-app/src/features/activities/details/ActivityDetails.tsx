import React, { useContext, useEffect } from "react";
import { Card, Image, Button, Grid } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps, Link } from "react-router-dom";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import { ActivityDetailsInfo } from "./ActivityDetailsInfo";
import { ActivityDetailsChat } from "./ActivityDetailsChat";
import { ActivityDetailsSideBar } from "./ActivityDetailsSideBar";

interface IDetailParams {
  id: string;
}

export const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    selectedActivity,
    loadActivity,
    loadingInitial,
  } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id)
  }, [loadActivity, match.params.id]);

  if (loadingInitial || !selectedActivity) return <LoadingComponent content='Loading activity...'/>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={selectedActivity}/>
        <ActivityDetailsInfo activity={selectedActivity}/>
        <ActivityDetailsChat/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailsSideBar/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
