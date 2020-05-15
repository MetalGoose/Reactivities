import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashBoard } from "../../features/activities/dashboard/ActivityDashBoard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);

  const [editMode, setEditMode] = useState(false);

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  /**
   * Хранит в себе выбранную активность
   * @param id of selected activity
   */
  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]); // Добавляем в массив старые активности + новую
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity]); // Обновляем массив акивностей 
    setEditMode(false);
    setSelectedActivity(activity);
  }

  /**
   * Возвращает все активности кроме указанной
   * @param id id активности которую требуется удалить
   */
  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
  }


  /**
   * useEffect Вызывается всякий раз когда компонент рендерится
   * второй параметр для того что бы вызов происходил только один раз - по сути это аналогаично вызову componentDidMount
   */
  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        let activities: IActivity[] = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0]; // API возвращает дату слишком точно. Урезаем ее до секунд
          activities.push(activity);
        });
        setActivities(activities);
      });
  }, []);

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm}/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashBoard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Fragment>
  );
};

export default App;
