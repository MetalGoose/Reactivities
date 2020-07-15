import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable selectedActivity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false; //Индикатор загрузки при нажатии на кнопку
    @observable target = '';

    @computed get activitiesByDate() : IActivity[] {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }
    

    @action loadActivities = async () => {
        this.loadingInitial = true;
        //async/await способ
        try {
            const activities = await agent.Activities.list();
            runInAction('Loading activities',() => { // Первый параметр - имя действия. Не обязательно, но может помочь в Mobx dev tools
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0]; // API возвращает дату слишком точно. Урезаем ее до секунд
                    this.activityRegistry.set(activity.id, activity);
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('Loading activities finished',() => this.loadingInitial = false);
        }
        //promise chain способ
        // agent.Activities.list()
        //     .then((activities) => {
        //         activities.forEach(activity => {
        //         activity.date = activity.date.split('.')[0]; // API возвращает дату слишком точно. Урезаем ее до секунд
        //         this.activities.push(activity);
        //         });
        //     })
        //     .catch((error) => console.log(error))
        //     .finally(() => this.loadingInitial = false); // finally - выполнится даже если промис будет не выполнен
    }

    /**
     * Устанавливает выбранную активность, получая ее из activityRegistry или с сервера
     */
    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
        } else {
            try {
                this.loadingInitial = true;
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.selectedActivity = activity;
                })
            } catch (error) {
                console.log(error);
            } finally {
                runInAction('getting activity finished', () => this.loadingInitial = false);
            }
        }
    }

    /**
     * Возвращает активность с указанным id или undefined
     */
    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('Create activity',() => {
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('Create activity finished',() => {
                this.submitting = false;
            });
        }
    }

    @action clearActivity = () => {
        this.selectedActivity = null;
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('Edit activity',() => {
                this.activityRegistry.set(activity.id, activity); // Updating activity by id
                this.selectedActivity = activity;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('Edit activity finished',() => {
                this.submitting = false;
            });
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('Delete activity', () => {
                this.activityRegistry.delete(id);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction('Delete activity finished', () => {
                this.submitting = false;
                this.target = '';
            });
        }
    }
}

export default createContext(new ActivityStore())