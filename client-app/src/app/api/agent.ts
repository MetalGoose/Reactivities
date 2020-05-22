/**
 * Этот файл содержит все вызовы к API
 */

import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responceBody = (response: AxiosResponse) => response.data;

/**
 * Функция имитирует задержку с сервером
 * Является аналогом метода расширения из C#
 * Вторая функция принимающая параметр response нужна для указания объекта, который требуется расширить
 */
const sleep = (ms: number) => (response: AxiosResponse) => 
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

    
const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responceBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responceBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responceBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responceBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
}

export default {
    Activities
}