import React, { useContext, useEffect } from "react";
import { Card, Image, Button } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";

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
    openEditForm,
    cancelSelectedActivity,
    loadActivity,
    loadingInitial,
  } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id)
  }, [loadActivity]);

  if (loadingInitial || !selectedActivity) return <LoadingComponent content='Loading activity...'/>

  return (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${selectedActivity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{selectedActivity!.title}</Card.Header>
        <Card.Meta>
          <span>{selectedActivity!.date}</span>
        </Card.Meta>
        <Card.Description>{selectedActivity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            onClick={() => openEditForm(selectedActivity!.id)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => history.push('/activities')}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
