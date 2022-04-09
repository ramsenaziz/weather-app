import { Suspense, lazy } from 'react';
import Spinner from './components/Spinner/Spinner';

const Forecast = lazy(() => import('./components/Forecast/Forecast'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<Spinner />}>
        <Forecast />
      </Suspense>
    </div>
  );
}

export default App;
