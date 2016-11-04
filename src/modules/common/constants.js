import {UnitState} from '../unit/constants';

export const API_URL = 'http://api.hel.fi/servicemap/v1';
export const APP_NAME = 'outdoors-sports-map';

export const HEADER_HEIGHT = 66;

export type Action = {
  type: string,
  payload: Object
};

export type FetchAction = {
  type: string,
  payload: {
    params: Object
  }
};

export type EntityAction = {
  type: string,
  payload: {
    entities: Object,
    result: mixed
  }
};

export type AppState = {
  unit: UnitState
};

export const routerPaths = {
  singleUnit: 'unit/:unitId'
};

export const mobileBreakpoint = 768;
