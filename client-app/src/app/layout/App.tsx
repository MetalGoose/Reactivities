import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashBoard } from "../../features/activities/dashboard/ActivityDashBoard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

const App = () => {

  //#region states

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); //Индикатор загрузки при нажатии на кнопку
  const [target, setTarget] = useState('');

  //#endregion

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
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]); // Добавляем в массив старые активности + новую
      setEditMode(false);
      setSelectedActivity(activity);
    }).then(() => setSubmitting(false));
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]); // Обновляем массив акивностей 
      setEditMode(false);
      setSelectedActivity(activity);
    }).then(() => setSubmitting(false));
  }

  /**
   * Возвращает все активности кроме указанной
   * @param id id активности которую требуется удалить
   */
  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
    }).then(() => setSubmitting(false));
  }


  /**
   * useEffect Вызывается всякий раз когда компонент рендерится
   * второй параметр для того что бы вызов происходил только один раз - по сути это аналогаично вызову componentDidMount
   */ 
  useEffect(() => {
    agent.Activities.list()
      .then((response) => {
        let activities: IActivity[] = [];
        response.forEach(activity => {
          activity.date = activity.date.split('.')[0]; // API возвращает дату слишком точно. Урезаем ее до секунд
          activities.push(activity);
        });
        setActivities(activities);
      }).then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content={"Loading activities..."}/>

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
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
