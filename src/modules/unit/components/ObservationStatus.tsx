import { useTranslation } from "react-i18next";

import Time from "../../home/components/Time";
import TimeAgo from "../../home/components/TimeAgo";
import { Unit } from "../constants";
import {
  getAttr,
  getCondition,
  getObservation,
  getObservationTime,
  getUnitQuality,
} from "../helpers";

type StatusBarProps = {
  quality: string;
  label: String;
};

export function StatusBar({ quality, label }: StatusBarProps) {
  return <div className={`observation-status__bar--${quality}`}>{label}</div>;
}

type StatusUpdatedProps = {
  time: Date;
};

export function StatusUpdated({ time }: StatusUpdatedProps) {
  const { t } = useTranslation();

  return (
    <div
      className="obervation-status__time"
      style={{
        fontSize: 12,
      }}
    >
      {t("UNIT.UPDATED")} <Time time={time} />
    </div>
  );
}

type StatusUpdatedAgoProps = {
  time: Date;
  sensorName: string;
};

export function StatusUpdatedAgo({
  time,
  sensorName = "",
}: StatusUpdatedAgoProps) {
  return (
    <div
      className="obervation-status__time"
      style={{
        fontSize: 12,
      }}
    >
      <TimeAgo time={time} />
      {sensorName && ` (${sensorName})`}
    </div>
  );
}

type MaintenanceUpdatedProps = {
  name: Record<string, any>;
  time: Date;
};

export function MaintenanceUpdated({ name, time }: MaintenanceUpdatedProps) {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <div
      className="observation-status__time"
      style={{
        fontSize: 12,
      }}
    >
      {getAttr(name, language)} <Time time={time} />
    </div>
  );
}

type ObservationStatusProps = {
  unit: Unit;
};

function ObservationStatus({ unit }: ObservationStatusProps) {
  const {
    t,
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const quality = getUnitQuality(unit);
  const condition = getCondition(unit);
  const maintenance = getObservation(unit, "maintenance");

  return (
    <div className="observation-status">
      <StatusBar
        quality={quality}
        label={
          condition && condition.name
            ? getAttr(condition.name, language) || t("UNIT.UNKNOWN")
            : t("UNIT.UNKNOWN")
        }
      />
      {condition && <StatusUpdated time={getObservationTime(condition)} />}
      {maintenance && (
        <MaintenanceUpdated
          name={maintenance.name}
          time={getObservationTime(maintenance)}
        />
      )}
    </div>
  );
}

export default ObservationStatus;
