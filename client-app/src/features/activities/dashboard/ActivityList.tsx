import React, { useContext } from "react";
import ActivityStore from "../../../app/stores/activityStore";
import { Item, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ActivityListItem } from "./ActivityListItem";
import { IActivity } from "../../../app/models/activity";

export const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;

  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((activity: IActivity) => (
          <ActivityListItem
            key={activity.id}
            activity={activity}
          ></ActivityListItem>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
