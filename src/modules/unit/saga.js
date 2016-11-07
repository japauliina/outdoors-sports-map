import {takeLatest} from 'redux-saga';
import {call, fork, put} from 'redux-saga/effects';
import {arrayOf} from 'normalizr';
import {receiveUnits, receiveSearchResult} from './actions';
import {UnitActions, unitSchema, SearchActions} from './constants';
import {FetchAction} from '../common/constants';
import {createUrl, createRequest, callApi, normalizeEntityResults} from '../api/helpers';

function* fetchUnits({payload: {params}}: FetchAction) {
  const request = createRequest(createUrl('unit', params));
  const {bodyAsJson} = yield call(callApi, request);
  const data = normalizeEntityResults(bodyAsJson.results, arrayOf(unitSchema));
  yield put(receiveUnits(data));
}

function* search({payload}) {
  const params = {input: payload, service: '33418,33417', page_size: 1000}; //Service key contains filters for target types
  console.log(params);
  const request = createRequest(createUrl('search/', params));
  const {bodyAsJson} = yield call(callApi, request);
  console.log(bodyAsJson);
  const data = bodyAsJson.results ? normalizeEntityResults(bodyAsJson.results, arrayOf(unitSchema)): [];
  yield put(receiveSearchResult(data));
}

function* watchFetchUnits() {
  yield takeLatest(UnitActions.FETCH, fetchUnits);
}

function* watchSearchTarget() {
  yield takeLatest(SearchActions.SEARCH, search);
}

export default function* saga() {
  return [
    yield fork(watchFetchUnits),
    yield fork(watchSearchTarget)
  ];
}