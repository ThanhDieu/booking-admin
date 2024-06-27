import Icon from '@ant-design/icons';
import { ReactComponent as DashboardSvg } from 'assets/icons/dashboard.svg';
import { ReactComponent as AgencySvg } from 'assets/icons/agency.svg';
import { ReactComponent as DottedSquare } from 'assets/icons/dottedSquare.svg';
import { ReactComponent as HouseSvg } from 'assets/icons/house.svg';
import { ReactComponent as PlaneArrivalSvg } from 'assets/icons/planeArrival.svg';
import { ReactComponent as PlaneDepartureSvg } from 'assets/icons/planeDeparture.svg';
import { ReactComponent as MoonSvg } from 'assets/icons/moon.svg';
import { ReactComponent as MoonColorSvg } from 'assets/icons/moon-solid.svg';
import { ReactComponent as SunSvg } from 'assets/icons/sun.svg';
import { ReactComponent as SunColorSvg } from 'assets/icons/sun-solid.svg';
import { ReactComponent as GlobalSvg } from 'assets/icons/global.svg';
import { ReactComponent as CheckSvg } from 'assets/icons/check.svg';
import {
  dashboardMenuIcon,
  propertiesMenuIcon,
  reservationMenuIcon,
  voucherMenuIcon,
  tagsMenuIcon,
  activitiesMenuIcon,
  landscapeMenuIcon,
  mediaMenuIcon,
  settingMenuIcon,
  moonMenuIcon,
  bundleMenuIcon,
  serviceMenuIcon,
  tasksMenuIcon,
  inventoriesMenuIcon,
  buildMenuIcon,
  functionMenuIcon,
  roomCategoryMenuIcon,
  advertisingMenuIcon
} from 'assets/icons/menu';
import {
  arrowRight,
  arrival,
  departure,
  bed,
  info,
  tagRoom,
  creditCard,
  cancel,
  calendar,
  userGroup,
  hotel,
  archive
} from 'assets/icons/others';

const mapper: {
  [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
  dashboard: DashboardSvg,
  agency: AgencySvg,
  dottedSquare: DottedSquare,
  planeDeparture: PlaneDepartureSvg,
  planeArrival: PlaneArrivalSvg,
  house: HouseSvg,
  check: CheckSvg,
  moon: MoonSvg,
  sun: SunSvg,
  moonColor: MoonColorSvg,
  sunColor: SunColorSvg,
  global: GlobalSvg,
  dashboardMenuIcon,
  propertiesMenuIcon,
  reservationMenuIcon,
  voucherMenuIcon,
  tagsMenuIcon,
  activitiesMenuIcon,
  landscapeMenuIcon,
  mediaMenuIcon,
  settingMenuIcon,
  moonMenuIcon,
  bundleMenuIcon,
  serviceMenuIcon,
  tasksMenuIcon,
  inventoriesMenuIcon,
  buildMenuIcon,
  functionMenuIcon,
  arrowRight,
  arrival,
  departure,
  bed,
  info,
  tagRoom,
  creditCard,
  cancel,
  calendar,
  userGroup,
  hotel,
  roomCategoryMenuIcon,
  advertisingMenuIcon,
  archive
};

export interface IconProps {
  name: string;
  className?: string;
  fill?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
}

function XIcon(props: IconProps) {
  const { name, ...restProps } = props;

  const Svg = mapper[name];

  return <Icon {...restProps} component={Svg} />;
}

export default XIcon;
