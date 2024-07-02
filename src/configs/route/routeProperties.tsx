/* eslint-disable @typescript-eslint/no-unused-vars */
import { paths } from 'constant';
import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { PrivateRoute } from '.';
import { RoleMode } from 'configs/const/auth';

const Home = React.lazy(() => import('pages/@booking/HomePage'));
const Reservations = React.lazy(() => import('pages/@booking/ReservationsPage'));
const ReservationDetail = React.lazy(
  () => import('pages/@booking/ReservationsPage/ReservationDetailPage')
);
const CreateBooking = React.lazy(() => import('pages/@booking/ReservationsPage/CreateBooking'));

const Bundles = React.lazy(() => import('pages/@booking/@property/BundlesPage'));
const BundleDetail = React.lazy(
  () => import('pages/@booking/@property/BundlesPage/sub/BundleDetailPage/BundleDetailPage')
);
const ServiceList = React.lazy(() => import('pages/@booking/ServiceListPage'));
const ServiceListDetail = React.lazy(
  () => import('pages/@booking/ServiceListPage/sub/ServiceListDetailPage')
);
const BookingDetail = React.lazy(() => import('pages/@booking/@property/BookingDetailPage'));

const Tags = React.lazy(() => import('pages/@booking/TagsPage'));
const Policies = React.lazy(() => import('pages/@booking/PoliciesPage'));
const PolicyDetail = React.lazy(
  () => import('pages/@booking/PoliciesPage/sub/PolicyDetailPage/PolicyDetailPage')
);
const Users = React.lazy(() => import('pages/@booking/UsersPage'));
const UserDetail = React.lazy(
  () => import('pages/@booking/UsersPage/sub/UserDetailPage/UserDetailPage')
);
const Tasks = React.lazy(() => import('pages/@booking/@property/TasksPage'));
const PropertySettingPage = React.lazy(() => import('pages/@booking/@property/PropertySettingPage'));
const RatePlans = React.lazy(() => import('pages/@booking/@property/RatePlansPage'));
const RatePlanCreate = React.lazy(
  () => import('pages/@booking/@property/RatePlansPage/RatePlanCreate')
);
const Availability = React.lazy(() => import('pages/@booking/@property/AvailabilityPage'));

const Units = React.lazy(() => import('pages/@booking/@property/UnitsPage'));
const UnitDetail = React.lazy(
  () => import('pages/@booking/@property/UnitsPage/sub/UnitDetailPage/UnitDetailPage')
);
const UnitGroups = React.lazy(() => import('pages/@booking/@property/UnitGroupsPage'));
const UnitGroupsDetail = React.lazy(
  () =>
    import('pages/@booking/@property/UnitGroupsPage/sub/UnitGroupsDetailPage/UnitGroupsDetailPage')
);

const bundleChildrens: RouteObject[] = [];

//property
const extendedPropertyRoutes: RouteObject[] = [
  {
    path: paths.propertyCode,
    element: (
      <PrivateRoute
        renderIfTrue={(state, location, code) => {
          if (code && [`/${code}`, `/${code}/`].includes(location?.pathname)) {
            return false;
          }
          return true;
        }}
        fallBackComponent={(code) => <Navigate to={`/${code}/${paths.home}`} />}
      >
        <Outlet />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        path: paths.home,
        element: <Home />
      },
      {
        path: paths.reservations,
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <Reservations />
          },
          {
            path: paths.create,
            element: <CreateBooking />
          }
        ]
      },
      {
        path: paths.reservationDetail,
        element: <ReservationDetail />,
        children: [
          {
            path: paths.general,
            element: <ReservationDetail />
          },
          {
            path: paths.guests,
            element: <ReservationDetail />
          },
          {
            path: paths.travelDates,
            element: <ReservationDetail />
          },
          {
            path: paths.extras,
            element: <ReservationDetail />
          },
          {
            path: paths.folio,
            element: <ReservationDetail />
          },
          {
            path: paths.invoices,
            element: <ReservationDetail />
          }
        ]
      },
      {
        path: paths.bundles,
        element: (
          <PrivateRoute
            renderIfTrue={(state, location, code) => {
              if (
                code &&
                [`/${code}/${paths.bundles}`, `/${code}/${paths.bundles}/`].includes(
                  location?.pathname
                )
              )
                return false;
              return true;
            }}
            fallBackComponent={(code) => (
              <Navigate to={`/${code}/${paths.bundles}/${paths.bundlesOverview}`} />
            )}
          >
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          {
            path: paths.bundlesOverview,
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <Bundles />
              },
              {
                path: paths.create,
                element: <BundleDetail />
              },
              {
                path: paths.duplicate,
                element: (
                  <PrivateRoute
                    renderIfTrue={(state, location, code) => {
                      if (
                        code &&
                        [
                          `/${code}/${paths.bundles}/${paths.bundlesOverview}/${paths.duplicate}`,
                          `/${code}/${paths.bundles}/${paths.bundlesOverview}/${paths.duplicate}/`
                        ].includes(location?.pathname)
                      )
                        return false;
                      return true;
                    }}
                    fallBackComponent={(code) => (
                      <Navigate to={`/${code}/${paths.bundles}/${paths.bundlesOverview}`} />
                    )}
                  >
                    <Outlet />
                  </PrivateRoute>
                ),
                children: [
                  {
                    path: paths.id,
                    element: <BundleDetail />
                  }
                ]
              },
              {
                path: paths.id,
                element: <BundleDetail />
              }
            ]
          },
          {
            path: paths.bundlesTemplate,
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <Bundles />
              },
              {
                path: paths.create,
                element: <BundleDetail />
              },
              {
                path: paths.duplicate,
                element: (
                  <PrivateRoute
                    renderIfTrue={(state, location, code) => {
                      if (
                        code &&
                        [
                          `/${code}/${paths.bundles}/${paths.bundlesTemplate}/${paths.duplicate}`,
                          `/${code}/${paths.bundles}/${paths.bundlesTemplate}/${paths.duplicate}/`
                        ].includes(location?.pathname)
                      )
                        return false;
                      return true;
                    }}
                    fallBackComponent={(code) => (
                      <Navigate to={`/${code}/${paths.bundles}/${paths.bundlesTemplate}`} />
                    )}
                  >
                    <Outlet />
                  </PrivateRoute>
                ),
                children: [
                  {
                    path: paths.id,
                    element: <BundleDetail />
                  }
                ]
              },
              {
                path: paths.id,
                element: <BundleDetail />
              }
            ]
          },
          {
            path: paths.bundlesTemplate,
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <Bundles />
              },
              {
                path: paths.create,
                element: <BundleDetail />
              },
              {
                path: paths.duplicate,
                element: (
                  <PrivateRoute
                    renderIfTrue={(state, location, code) => {
                      if (
                        code &&
                        [
                          `/${code}/${paths.bundles}/${paths.bundlesTemplate}/${paths.duplicate}`,
                          `/${code}/${paths.bundles}/${paths.bundlesTemplate}/${paths.duplicate}/`
                        ].includes(location?.pathname)
                      )
                        return false;
                      return true;
                    }}
                    fallBackComponent={(code) => (
                      <Navigate to={`/${code}/${paths.bundles}/${paths.bundlesTemplate}`} />
                    )}
                  >
                    <Outlet />
                  </PrivateRoute>
                ),
                children: [
                  {
                    path: paths.id,
                    element: <BundleDetail />
                  }
                ]
              },
              {
                path: paths.id,
                element: <BundleDetail />
              }
            ]
          },
          {
            path: paths.bundlesArchive,
            element: <Outlet />,
            children: [
              {
                path: '',
                element: <Bundles />
              },
              {
                path: paths.create,
                element: <BundleDetail />
              },
              {
                path: paths.duplicate,
                element: (
                  <PrivateRoute
                    renderIfTrue={(state, location, code) => {
                      if (
                        code &&
                        [
                          `/${code}/${paths.bundles}/${paths.bundlesArchive}/${paths.duplicate}`,
                          `/${code}/${paths.bundles}/${paths.bundlesArchive}/${paths.duplicate}/`
                        ].includes(location?.pathname)
                      )
                        return false;
                      return true;
                    }}
                    fallBackComponent={(code) => (
                      <Navigate to={`/${code}/${paths.bundles}/${paths.bundlesArchive}`} />
                    )}
                  >
                    <Outlet />
                  </PrivateRoute>
                ),
                children: [
                  {
                    path: paths.id,
                    element: <BundleDetail />
                  }
                ]
              },
              {
                path: paths.id,
                element: <BundleDetail />
              }
            ]
          }
        ]
      },
      {
        path: paths.inventory,
        element: (
          <PrivateRoute
            renderIfTrue={(state, location, code) => {
              if (
                code &&
                [`/${code}/${paths.inventory}`, `/${code}/${paths.inventory}/`].includes(
                  location?.pathname
                )
              )
                return false;
              return true;
            }}
            fallBackComponent={(code) => (
              <Navigate to={`/${code}/${paths.inventory}/${paths.unitGroups}`} />
            )}
          >
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          {
            path: paths.unitGroups,
            element: <UnitGroups />
          },
          {
            path: `${paths.unitGroups}/${paths.create}`,
            element: <UnitGroupsDetail />
          },
          {
            path: paths.unitGroupsDetail,
            element: <UnitGroupsDetail />
          },
          {
            path: paths.units,
            element: <Units />
          },
          {
            path: paths.unitDetail,
            element: <UnitDetail />
          },
          {
            path: `${paths.units}/${paths.create}`,
            element: <UnitDetail />
          }
        ]
      },
      // {
      //   path: paths.rates,
      //   element: (
      //     <PrivateRoute
      //       renderIfTrue={(state, location, code) => {
      //         if (
      //           code &&
      //           (location?.pathname === `/${code}/${paths.rates}` ||
      //             location?.pathname === `/${code}/${paths.rates}/`)
      //         )
      //           return false;
      //         return true;
      //       }}
      //       fallBackComponent={(code) => (
      //         <Navigate to={`/${code}/${paths.rates}/${paths.ratePlans}/${paths.list}`} />
      //       )}
      //     >
      //       <Outlet />
      //     </PrivateRoute>
      //   ),
      //   children: [
      //     {
      //       path: paths.ratePlans,
      //       element: (
      //         <PrivateRoute
      //           renderIfTrue={(state, location, code) => {
      //             if (
      //               code &&
      //               (location?.pathname === `/${code}/${paths.rates}/${paths.ratePlans}` ||
      //                 location?.pathname === `/${code}/${paths.rates}/${paths.ratePlans}/`)
      //             )
      //               return false;
      //             return true;
      //           }}
      //           fallBackComponent={(code) => (
      //             <Navigate to={`/${code}/${paths.rates}/${paths.ratePlans}/${paths.list}`} />
      //           )}
      //         >
      //           <Outlet />
      //         </PrivateRoute>
      //       ),
      //       children: [
      //         {
      //           path: paths.list,
      //           element: <RatePlans />
      //         },
      //         {
      //           path: paths.prices,
      //           element: <RatePlans />
      //         },
      //         {
      //           path: paths.create,
      //           element: <RatePlanCreate />
      //         },
      //         {
      //           path: paths.id,
      //           element: <RatePlanCreate />
      //         }
      //       ]
      //     }
      //   ]
      // },
      {
        path: paths.services,
        element: <Outlet />,
        children: [
          {
            path: '',
            element: <ServiceList />
          },

          {
            path: paths.create,
            element: <ServiceListDetail />
          },
          {
            path: paths.id,
            element: <ServiceListDetail />
          }
        ]
      },
      {
        path: paths.bookings,
        element: (
          <PrivateRoute
            renderIfTrue={(state, location, code) => {
              if (
                code &&
                [`/${code}/${paths.bookings}`, `/${code}/${paths.bookings}/`].includes(
                  location?.pathname
                )
              )
                return false;
              return true;
            }}
            fallBackComponent={(code) => <Navigate to={`/${code}/${paths.reservations}`} />}
          >
            <Outlet />
          </PrivateRoute>
        ),
        children: [
          {
            path: `${paths.id}`,
            element: <BookingDetail />,
            children: [
              {
                path: `${paths.reservations}`,
                element: <BookingDetail />
              },
              {
                path: `${paths.booker}`,
                element: <BookingDetail />
              },
              {
                path: `${paths.payment}`,
                element: <BookingDetail />
              }
            ]
          }
        ]
      },
      // {
      //   path: paths.policies,
      //   element: (
      //     <PrivateRoute
      //       renderIfTrue={(state, location, code) => {
      //         if (
      //           code &&
      //           (location?.pathname === `/${code}/${paths.policies}` ||
      //             location?.pathname === `/${code}/${paths.policies}/`)
      //         )
      //           return false;
      //         return true;
      //       }}
      //       fallBackComponent={(code) => (
      //         <Navigate to={`/${code}/${paths.policies}/${paths.cancellation}`} />
      //       )}
      //     >
      //       <Outlet />
      //     </PrivateRoute>
      //   ),

      //   children: [
      //     {
      //       path: paths.cancellation,
      //       element: <Outlet />,
      //       children: [
      //         { path: '', element: <Policies /> },
      //         {
      //           path: paths.id,
      //           element: <PolicyDetail />
      //         },
      //         {
      //           path: paths.create,
      //           element: <PolicyDetail />
      //         }
      //       ]
      //     },
      //     {
      //       path: paths.noShow,
      //       element: <Outlet />,
      //       children: [
      //         { path: '', element: <Policies /> },
      //         {
      //           path: paths.id,
      //           element: <PolicyDetail />
      //         },
      //         {
      //           path: paths.create,
      //           element: <PolicyDetail />
      //         }
      //       ]
      //     }
      //   ]
      // },

      {
        path: paths.detail,
        element: <PropertySettingPage />
      },
      {
        path: paths.users,
        element: <Users />
      },
      // {
      //   path: paths.userDetail,
      //   element: <UserDetail />
      // },
      {
        path: paths.tags,
        element: <Tags />
      },
      {
        path: paths.tasks,
        element: (
          <PrivateRoute
            renderIfTrue={(state) =>
              !!state?.booking?.auth?.profile?.roles?.some(
                (role) =>
                  role?.extendedData?.priority === RoleMode.SuperAdmin ||
                  role?.extendedData?.priority === RoleMode.HotelDirector
              )
            }
          >
            <Tasks />
          </PrivateRoute>
        )
      }
      // {
      //   path: paths.availability,
      //   element: <Availability />
      // }
    ]
  }
];

export default extendedPropertyRoutes;
