import { MenuProps } from 'antd';
import XIcon from 'components/shared/Icon';
import renderMenuLabel from 'components/shared/i18nextRender';
import { paths } from 'constant';

export type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick
  } as MenuItem;
}
const code = ':code';

const items: MenuItem[] = [
  getItem(
    renderMenuLabel('sidebar.dashboard', 'sidebar'),
    paths.home,
    <XIcon className="text-lg" name="dashboardMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.properties', 'sidebar'),
    paths.properties,
    <XIcon className="text-lg" name="propertiesMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.reservations', 'sidebar'),
    paths.reservations,
    <XIcon className="text-lg " name="reservationMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.advertising', 'sidebar'),
    paths.advertising,
    <XIcon className="text-lg " name="advertisingMenuIcon" />,
    [
      getItem(renderMenuLabel('sidebar.offer', 'sidebar'), `${paths.offer}`),
      getItem(renderMenuLabel('sidebar.newsletter', 'sidebar'), `${paths.newsletter}`)
    ]
  ),
  // getItem(
  //   renderMenuLabel('sidebar.holiday_Package', 'sidebar'),
  //   paths.holidayPackage,
  //   <StarOutlined className={iconSize} />
  // ),
  getItem(
    renderMenuLabel('sidebar.vouchers', 'sidebar'),
    paths.vouchers,
    <XIcon className="text-lg" name="voucherMenuIcon" />
  ),

  getItem(
    renderMenuLabel('sidebar.tags', 'sidebar'),
    paths.tags,
    <XIcon className="text-lg" name="tagsMenuIcon" />
  ),

  getItem(
    renderMenuLabel('sidebar.activities', 'sidebar'),
    `${paths.activities}`,
    <XIcon className="text-lg" name="activitiesMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.landscapes', 'sidebar'),
    `${paths.landscapes}`,
    <XIcon className="text-lg" name="landscapeMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.room-category', 'sidebar'),
    `${paths.roomCategory}`,
    <XIcon className="text-lg" name="roomCategoryMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.media', 'sidebar'),
    `${paths.media}`,
    <XIcon className="text-lg" name="mediaMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.function', 'sidebar'),
    `${paths.function}`,
    <XIcon className="text-lg" name="functionMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.setting', 'sidebar'),
    'setting',
    <XIcon className="text-lg" name="settingMenuIcon" />,
    [getItem(renderMenuLabel('sidebar.users', 'sidebar'), `${paths.users}`)]
  ),
  getItem(
    renderMenuLabel('sidebar.build_ibe', 'sidebar'),
    `${paths.buildProcess}`,
    <XIcon className="text-lg" name="buildMenuIcon" />
  )
];
export default items;

export const propertyItems: MenuItem[] = [
  getItem(
    renderMenuLabel('sidebar.dashboard', 'sidebar'),
    `${code}/${paths.home}`,
    <XIcon className="text-lg" name="dashboardMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.reservations', 'sidebar'),
    `${code}/${paths.reservations}`,
    <XIcon className="text-lg" name="reservationMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.bundle', 'sidebar'),
    `bundles`,
    <XIcon className="text-lg" name="bundleMenuIcon" />,
    [
      getItem(
        renderMenuLabel('sidebar.overview', 'sidebar'),
        `${code}/${paths.bundles}/${paths.bundlesOverview}`
      ),
      getItem(
        renderMenuLabel('sidebar.archive', 'sidebar'),
        `${code}/${paths.bundles}/${paths.bundlesArchive}`
      )
      // getItem(
      //   renderMenuLabel('sidebar.templates', 'sidebar'),
      //   `${code}/${paths.bundles}/${paths.bundlesTemplate}`
      // )
      // getItem(
      //   renderMenuLabel('sidebar.newsletter', 'sidebar'),
      //   `${code}/${paths.bundles}/${paths.bundlesNewsletter}`
      // )
    ]
  ),
  getItem(
    renderMenuLabel('sidebar.tasks', 'sidebar'),
    `${code}/${paths.tasks}`,
    <XIcon className="text-lg" name="tasksMenuIcon" />
  ),

  // getItem(
  //   'Availability',
  //   `${code}/${paths.availability}`,
  //   <FireOutlined className={iconSize} />
  // ),
  getItem(
    renderMenuLabel('sidebar.inventory', 'sidebar'),
    'inventory',
    <XIcon className="text-lg" name="inventoriesMenuIcon" />,
    [
      getItem(
        renderMenuLabel('sidebar.unit-groups', 'sidebar'),
        `${code}/${paths.inventory}/${paths.unitGroups}`
      ),
      getItem(
        renderMenuLabel('sidebar.units', 'sidebar'),
        `${code}/${paths.inventory}/${paths.units}`
      )
      // getItem('Unit attributes', `${code}/${paths.inventory}/${paths.attributes}`)
    ]
  ),
  // getItem('Rates', 'rates', <DollarOutlined className={iconSize} />, [
  //   getItem('Rate plans', `${code}/${paths.rates}/${paths.ratePlans}/${paths.list}`)
  // ]),
  getItem(
    renderMenuLabel('sidebar.services', 'sidebar'),
    `${code}/${paths.services}`,
    <XIcon className="text-lg" name="serviceMenuIcon" />
  ),
  getItem(
    renderMenuLabel('sidebar.tags', 'sidebar'),
    `${code}/${paths.tags}`,
    <XIcon className="text-lg" name="tagsMenuIcon" />
  ),
  // getItem(
  //   'Policies',
  //   `${code}/${paths.policies}`,
  //   <SecurityScanOutlined className={iconSize} />
  // ),

  getItem(
    renderMenuLabel('sidebar.setting', 'sidebar'),
    'settingProperty',
    <XIcon className="text-lg" name="settingMenuIcon" />,
    [
      getItem(renderMenuLabel('sidebar.detail', 'sidebar'), `${code}/${paths.detail}`),
      getItem(renderMenuLabel('sidebar.users', 'sidebar'), `${code}/${paths.users}`)
    ]
  )
];
