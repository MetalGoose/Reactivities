import React, { useContext, Fragment } from "react";
import ActivityStore from "../../../app/stores/activityStore";
import { Item, Segment, Label } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { ActivityListItem } from "./ActivityListItem";
import { IActivity } from "../../../app/models/activity";

export const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;

  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label key={group} size='large' color='blue'>
            {group}
          </Label>
          <Segment clearing>
            <Item.Group divided>
              {activities.map((activity: IActivity) => (
                <ActivityListItem
                  key={activity.id}
                  activity={activity}
                ></ActivityListItem>
              ))}
            </Item.Group>
          </Segment>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
