import { BrowserRouter } from 'react-router-dom';

const withRouter = (component: React.ReactElement) => {
  return <BrowserRouter>{component}</BrowserRouter>;
};

export default withRouter;
