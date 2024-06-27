import {
  ConfigProvider,
  HelmetHandler,
  MessageHandler,
  Router,
  SharedProvider,
  StoreProvider
} from 'components/wrapper';
import { paths } from 'constant';

function App() {
  return (
    <StoreProvider>
      <HelmetHandler>
        <MessageHandler>
          <ConfigProvider>
            <SharedProvider>
              <Router defaultRoute={paths.home} />
            </SharedProvider>
          </ConfigProvider>
        </MessageHandler>
      </HelmetHandler>
    </StoreProvider>
  );
}

export default App;
