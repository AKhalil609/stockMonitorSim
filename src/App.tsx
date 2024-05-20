import Header from './components/Header';
import './App.scss';
import StockSubscriber from './components/StockSubscriber';

function App() {
  return (
    <div id="app">
      <Header />
      <main className="main">
        <section className="main-header">
          <h1 className="heading1">Welcome to stock subscription simulator</h1>
          <p>Please enter a valid ISIN number in the input to subscribe to.</p>
        </section>

        <StockSubscriber />
      </main>
    </div>
  );
}

export default App;
