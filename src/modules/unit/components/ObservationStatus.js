// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import Time from '../../home/components/Time';
import TimeAgo from '../../home/components/TimeAgo';
import {
  getUnitQuality,
  getObservation,
  getCondition,
  getObservationTime,
  getAttr,
} from '../helpers';

type StatusBarProps = {
  quality: string,
  label: String,
};

export const StatusBar = ({ quality, label }: StatusBarProps) => (
  <div className={`observation-status__bar--${quality}`}>{label}</div>
);

type StatusUpdatedProps = {
  time: Date,
};

export const StatusUpdated = ({ time }: StatusUpdatedProps) => {
  const { t } = useTranslation();

  return (
    <div className="obervation-status__time" style={{ fontSize: 12 }}>
      {t('UNIT.UPDATED')} <Time time={time} />
    </div>
  );
};

type StatusUpdatedAgoProps = {
  time: Date,
  sensorName: string,
};

export const StatusUpdatedAgo = ({
  time,
  sensorName = '',
}: StatusUpdatedAgoProps) => (
  <div className="obervation-status__time" style={{ fontSize: 12 }}>
    <TimeAgo time={time} />
    {sensorName && ` (${sensorName})`}
  </div>
);

type MaintenanceUpdatedProps = {
  name: Object,
  time: Date,
};

export const MaintenanceUpdated = ({ name, time }: MaintenanceUpdatedProps) => {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <div className="observation-status__time" style={{ fontSize: 12 }}>
      {getAttr(name, language)} <Time time={time} />
    </div>
  );
};

type ObservationStatusProps = {
  unit: Object,
};

const ObservationStatus = ({ unit }: ObservationStatusProps) => {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const quality = getUnitQuality(unit);
  const condition = getCondition(unit);
  const maintenance = getObservation(unit, 'maintenance');

  return (
    <div className="observation-status">
      <StatusBar
        quality={quality}
        label={
          condition && condition.name
            ? getAttr(condition.name, language) || t('UNIT.UNKNOWN')
            : t('UNIT.UNKNOWN')
        }
      />
      {condition && (
        <StatusUpdated t={t} time={getObservationTime(condition)} />
      )}
      {maintenance && (
        <MaintenanceUpdated
          name={maintenance.name}
          activeLang={language}
          time={getObservationTime(maintenance)}
        />
      )}
    </div>
  );
};

export default ObservationStatus;
