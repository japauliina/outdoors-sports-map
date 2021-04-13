import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import className from 'classnames';

import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import { getUnitPosition, getAttr } from '../../unit/helpers';
import { getUnitById } from '../../unit/selectors';
import UnitDetails from '../../unit/components/UnitDetailsContainer';
import UnitBrowserContainer from '../../unit/components/UnitBrowserContainer';
import routerPaths from '../../common/routes';
import ApplicationHeader from '../../common/components/ApplicationHeader';
import useIsMobile from '../../common/hooks/useIsMobile';
import Page from '../../common/components/Page';
import Map from '../../map/components/Map';

function useTitle(selectedUnitId) {
  const {
    t,
    i18n: {
      languages: [activeLanguage],
    },
  } = useTranslation();
  const selectedUnit = useSelector((state) =>
    getUnitById(state, { id: selectedUnitId })
  );
  const title = [];

  title.push(t('APP.NAME'));

  if (selectedUnit) {
    title.push(` - ${getAttr(selectedUnit.name, activeLanguage)}`);
  }

  return title.join('');
}

function getLatLngToContainerPoint(ref, location) {
  const map = ref.current;

  if (!map) {
    return null;
  }

  return map.mapRef.leafletElement.latLngToContainerPoint(location);
}

function getContainerPointToLatLng(ref, location) {
  const map = ref.current;

  if (!map) {
    return null;
  }

  return map.mapRef.leafletElement.containerPointToLatLng(location);
}

function setView(ref, coordinates) {
  const map = ref.current;

  if (map) {
    map.setView(coordinates);
  }
}

function MapLayout({ content, map }) {
  return (
    <>
      {content}
      <div className="map-container">{map}</div>
    </>
  );
}

MapLayout.propTypes = {
  content: PropTypes.node.isRequired,
  map: PropTypes.node.isRequired,
};

function HomeContainer() {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const match = useRouteMatch(routerPaths.singleUnit);
  const isMobile = useIsMobile();

  const selectedUnitId = match ? match.params.unitId : null;
  const isUnitDetailsOpen = selectedUnitId !== null;

  const title = useTitle(selectedUnitId);

  const handleOnViewChange = useCallback((coordinates) => {
    setView(mapRef, coordinates);
  }, []);

  const handleCenterMapToUnit = useCallback(
    (unit) => {
      const location = getUnitPosition(unit);
      const pixelLocation = getLatLngToContainerPoint(mapRef, location);

      if (!isMobile) {
        // Offset by half the width of unit modal in order to center focus
        // on the visible map
        pixelLocation.x -= 200;
        const adjustedCenter = getContainerPointToLatLng(mapRef, pixelLocation);

        setView(mapRef, adjustedCenter);
      } else {
        // On mobile we want to move the map 250px down from the center, so the
        // big info box does not hide the selected unit.
        pixelLocation.y -= 250;
        const adjustedCenter = getContainerPointToLatLng(mapRef, pixelLocation);

        setView(mapRef, adjustedCenter);
      }
    },
    [isMobile]
  );

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchUnits());
    dispatch(fetchServices());
  }, []);

  return (
    <Page title={title}>
      <MapLayout
        content={
          <div
            className={className('map-foreground', {
              'is-filled': isUnitDetailsOpen,
            })}
          >
            <ApplicationHeader />
            <div
              className={className('map-foreground-unit-browser', {
                // Hide unit browser when the unit details is open with styling.
                // This is an easy way to retain the search state.
                hidden: isUnitDetailsOpen,
              })}
            >
              <UnitBrowserContainer
                mapRef={mapRef}
                onViewChange={handleOnViewChange}
              />
            </div>
            {isUnitDetailsOpen && (
              <UnitDetails
                unitId={selectedUnitId}
                onCenterMapToUnit={handleCenterMapToUnit}
              />
            )}
          </div>
        }
        map={
          <Map
            ref={mapRef}
            selectedUnitId={selectedUnitId}
            onCenterMapToUnit={handleCenterMapToUnit}
          />
        }
      />
    </Page>
  );
}

export default HomeContainer;
