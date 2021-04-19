import { mount } from "../../../../enzymeHelpers";
import UnitBrowserResultList, {
  UnitBrowserResultList as UnitBrowserResultListBase,
} from "../UnitBrowserResultList";

jest.mock("../../../unitConstants", () => ({
  ...jest.requireActual("../../../unitConstants"),
  UNIT_BATCH_SIZE: 1,
}));

const defaultProps = {
  units: [
    {
      id: 53916,
      name: {
        fi: "Mustavuori-Talosaari latu 5,5 km",
        sv: "Svarta backen-Husö skidspår 5,5 km",
      },
      street_address: {
        fi: "Niinisaarentie",
        sv: "Bastövägen",
        en: "Niinisaarentie",
      },
      www: {
        fi:
          "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
        sv:
          "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
        en:
          "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
      },
      phone: "+358 9 310 87906",
      address_zip: "00960",
      extensions: {
        maintenance_group: "kaikki",
        maintenance_organization: "helsinki",
      },
      municipality: "helsinki",
      services: [191],
      location: {
        type: "Point",
        coordinates: [25.171423, 60.234966],
      },
      connections: [],
      observations: [
        {
          unit: 53916,
          id: 51005,
          property: "ski_trail_condition",
          time: "2021-01-04T14:52:08.546026+0200",
          expiration_time: null,
          name: {
            fi: "Lumenpuute",
            sv: "Snöbrist",
            en: "Lack of snow",
          },
          quality: "unusable",
          value: "snowless",
          primary: true,
        },
      ],
    },
    {
      id: 54419,
      name: {
        fi: "Mustavuoren latu 2,1 km",
      },
      street_address: {
        fi: "Mustavuori",
        sv: "Svartbäcken",
        en: "Mustavuori",
      },
      www: null,
      phone: null,
      address_zip: "00960",
      extensions: {
        maintenance_group: "kaikki",
        maintenance_organization: "helsinki",
      },
      municipality: "helsinki",
      services: [191],
      location: {
        type: "Point",
        coordinates: [25.1415, 60.2288],
      },
      connections: [],
      observations: [
        {
          unit: 54419,
          id: 50985,
          property: "ski_trail_condition",
          time: "2021-01-04T14:48:26.140649+0200",
          expiration_time: null,
          name: {
            fi: "Lumenpuute",
            sv: "Snöbrist",
            en: "Lack of snow",
          },
          quality: "unusable",
          value: "snowless",
          primary: true,
        },
      ],
    },
  ],
  position: [1, 1],
  maxUnitCount: 0,
  services: {},
};

const getWrapper = (props) =>
  mount(<UnitBrowserResultList {...defaultProps} {...props} />);

describe("<UnitBrowserResultList />", () => {
  describe("show more link", () => {
    const getShowMoreLink = (wrapper) =>
      wrapper.find({
        children: "Näytä enemmän",
      });

    it("should be rendered", () => {
      const wrapper = getWrapper();

      expect(getShowMoreLink(wrapper).length).toEqual(1);
    });
    it("should prevent default action and load more unit on click", () => {
      const mockEvent = {
        preventDefault: jest.fn(),
      };

      const loadMoreUnitsSpy = jest
        .spyOn(UnitBrowserResultListBase.prototype, "loadMoreUnits")
        .mockImplementation(() => {});

      const wrapper = getWrapper();
      const showMoreLink = getShowMoreLink(wrapper);

      showMoreLink.simulate("click", mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(loadMoreUnitsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
