import { paths } from 'constant';
import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { PrivateRoute } from '.';
const Home = React.lazy(() => import('pages/@orion/HomePage'));
const Properties = React.lazy(() => import('pages/@orion/PropertiesPage'));
const Reservations = React.lazy(() => import('pages/@orion/ReservationsPage'));
const CreateBooking = React.lazy(() => import('pages/@orion/ReservationsPage/CreateBooking'));

const Users = React.lazy(() => import('pages/@orion/UsersPage'));
const Tags = React.lazy(() => import('pages/@orion/TagsPage'));
const Policies = React.lazy(() => import('pages/@orion/PoliciesPage'));
const Activities = React.lazy(() => import('pages/@orion/ActivitiesPage'));
const Landscape = React.lazy(() => import('pages/@orion/LandscapePage'));
const UserDetail = React.lazy(
  () => import('pages/@orion/UsersPage/sub/UserDetailPage/UserDetailPage')
);
const PropertySettingPage = React.lazy(() => import('pages/@orion/@property/PropertySettingPage'));
const Media = React.lazy(() => import('pages/@orion/@property/MediaPage'));
const Vouchers = React.lazy(() => import('pages/@orion/VouchersPage'));
const Bundles = React.lazy(() => import('pages/@orion/@property/BundlesPage'));
const BuildProcess = React.lazy(() => import('pages/@orion/BuildProcess'));
const Function = React.lazy(() => import('pages/@orion/Functional'));
const RoomCategory = React.lazy(() => import('pages/@orion/RoomCategory'));
const Offer = React.lazy(() => import('pages/@orion/OfferPage'));
const CreateOffer = React.lazy(() => import('pages/@orion/OfferPage/subs/CreateOffer'));
const OfferDetail = React.lazy(() => import('pages/@orion/OfferPage/OfferDetailPage'));

const CreateNewsletter = React.lazy(
  () => import('pages/@orion/NewsletterPage/subs/CreateNewsletter')
);
const NewsletterPage = React.lazy(() => import('pages/@orion/NewsletterPage'));

//account admin
const extendedRoutes: RouteObject[] = [
  {
    index: true,
    path: paths.home,
    element: <Home />
  },
  {
    path: paths.properties,
    element: <Properties />
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
    path: paths.create,
    element: <CreateBooking />
  },

  {
    path: paths.propertyCreate,
    element: <PropertySettingPage />
  },
  {
    path: paths.tags,
    element: <Tags />
  },
  {
    path: paths.users,
    element: (
      <PrivateRoute
        renderIfTrue={(state, location) => {
          if ([`/${paths.account}`, `/${paths.account}/`].includes(location?.pathname))
            return false;
          return true;
        }}
        fallBackComponent={() => <Navigate to={`/${paths.account}/${paths.users}`} />}
      >
        <Outlet />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <Users />
      },
      {
        path: paths.userDetail,
        element: <UserDetail />
      }
    ]
  },
  {
    path: paths.policies,
    element: <Policies />
  },
  {
    path: paths.create,
    element: <PropertySettingPage />
  },
  {
    path: paths.policyDetail,
    element: <PropertySettingPage />
  },
  {
    path: paths.media,
    element: <Media />
  },
  {
    path: paths.activities,
    element: <Activities />
  },
  {
    path: paths.landscapes,
    element: <Landscape />
  },
  {
    path: paths.roomCategory,
    element: <RoomCategory />
  },
  {
    path: paths.vouchers,
    element: <Vouchers />
  },
  {
    path: paths.holidayPackage,
    element: <Bundles />
  },
  {
    path: paths.buildProcess,
    element: <BuildProcess />
  },
  {
    path: paths.function,
    element: <Function />
  },

  {
    path: paths.offer,
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <Offer />
      },
      {
        path: paths.create,
        element: <CreateOffer />
      }
    ]
  },
  {
    path: paths.offerDetail,
    element: <OfferDetail />,
    children: [
      {
        path: paths.guests,
        element: <OfferDetail />
      },
      {
        path: paths.travelDates,
        element: <OfferDetail />
      },
      {
        path: paths.extras,
        element: <OfferDetail />
      }
    ]
  },
  {
    path: paths.newsletter,
    element: <Outlet />,
    children: [
      {
        path: '',
        element: <NewsletterPage />
      },
      {
        path: paths.create,
        element: <CreateNewsletter />
      },
      {
        path: paths.id,
        element: <CreateNewsletter />
      }
    ]
  }
];

export default extendedRoutes;
