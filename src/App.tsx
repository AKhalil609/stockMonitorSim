import Button from './components/Button'
import Card from './components/Card'
import Header from './components/Header'
import TextField from './components/TextField'
import "./App.scss"
import StockSubscriber from './components/StockSubscriber'

function App() {

  return (
    <div id='app'>
      <Header />
      <main className="main">
        <h1 className="heading1">Welcome to stock subscription simulator</h1>
        <p>Please enter a valid ISIN number in the input to subscribe to.</p>
        {/* <p>
          In the interest of saving you some time, we have provided a working Vue app with a few components to get you
          started.
        </p>
        <p>Feel free to use them and change them as you need.</p> */}
        {/* <ul className="component-list">
          <li>
            <p><code>TextField</code></p>
            <TextField placeholder="Placeholder" />
          </li>
          <li>
            <p><code>Card</code></p>
            <Card>
              <p>Generic card content</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ex, totam ducimus quam eligendi quasi
                laborum optio, tenetur, aperiam reprehenderit voluptates? A velit quia inventore amet excepturi pariatur
                praesentium. Quibusdam.
              </p>
            </Card>
          </li>
          <li>
            <p><code>Button</code></p>
            <Button>Button Label</Button>
          </li>
        </ul> */}
        <StockSubscriber />
      </main>
    </div>
  )
}

export default App
