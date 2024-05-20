# StockMonitorSim

StockMonitorSim is a web application for monitoring stock prices using WebSocket connections. It allows users to subscribe and unsubscribe to stock updates dynamically, display stock prices in a list view, and manage subscriptions in real-time.

## Features

- Real-time stock price updates using WebSockets.
- Dynamic subscription and unsubscription to stock updates.
- Validation for ISIN (International Securities Identification Number).
- User-friendly interface with notification messages.
- Built with React, TypeScript, Vite, and RxJS.
- Unit testing with Jest and React Testing Library.

## Project Structure

```
└── 📁src
    └── App.scss
    └── App.tsx
    └── 📁assets
        └── header-logo.svg
    └── 📁components
        └── 📁Button
            └── index.tsx
            └── style.scss
        └── 📁Card
            └── index.tsx
            └── style.scss
        └── 📁Header
            └── index.tsx
            └── style.scss
        └── 📁ISINInput
            └── ISINInput.test.tsx
            └── index.tsx
            └── style.scss
        └── 📁NotificationCard
            └── index.tsx
            └── style.scss
        └── 📁StockSubscriber
            └── StockSubscriber.test.tsx
            └── index.tsx
        └── 📁SubscribeUnsubscribeButton
            └── index.tsx
        └── 📁Table
            └── index.tsx
            └── style.scss
        └── 📁TextField
            └── index.tsx
            └── style.scss
        └── 📁hooks
            └── useISINValidation.test.ts
            └── useISINValidation.ts
            └── useStockService.test.ts
            └── useStockService.ts
    └── index.css
    └── main.tsx
    └── 📁services
        └── StockService.test.ts
        └── StockService.ts
    └── 📁utils
        └── debounce.ts
        └── mocks.ts
        └── testUtils.ts
    └── vite-env.d.ts
```

## Getting Started

### Prerequisites

- Node.js 16 or higher.

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/AKhalil609/stockMonitorSim.git
   cd stockmonitorsim
   ```

2. Install the dependencies:

   ```sh
   yarn
   ```

### Running the Application

To start the development server and the WebSocket server concurrently, run:

```sh
yarn dev
```

This will start the Vite development server and the WebSocket server.

### Building the Application

To build the application for production, run:

```sh
yarn build
```

### Previewing the Production Build

To preview the production build locally, run:

```sh
yarn preview
```

### Linting and Formatting

To lint the code, run:

```sh
yarn lint
```

To fix linting errors, run:

```sh
yarn lint:fix
```

To format the code with Prettier, run:

```sh
yarn format
```

### Running Tests

To run the tests, run:

```sh
yarn test
```

To run the tests in watch mode, run:

```sh
yarn test:watch
```

## Key Components and Hooks

### `StockService`

A service for managing WebSocket connections and subscriptions to stock data.

### `useStockService`

A custom hook for managing stock data subscriptions and connection status.

### `useISINValidation`

A custom hook for validating ISIN (International Securities Identification Number).

### `StockSubscriber`

A component for subscribing and unsubscribing to stock updates, displaying current stock data, and managing subscriptions.

### `SubscribeUnsubscribeButton`

A component for subscribing or unsubscribing to a stock based on its ISIN.

### `NotificationCard`

A component for displaying notifications to the user.

### `ISINInput`

A component for entering and validating an ISIN.

---

## Questions

1. What happens in case the WebSocket disconnects? How would you go further to keep
   the live data available or inform the user? Please discuss the challenges.
   - When the WebSocket disconnects, the handleSocketClose method is triggered. This method sets the connectionStatus to false, logs the disconnection, and initiates a reconnection attempt using the reconnect method, which waits 5 seconds before attempting to reconnect.
   In addition to that there is a notification card that appears notifying the user that he lost this connection

2. What happens if a user adds an instrument multiple times to their list? Please discuss possible challenges and mitigations.
    - The subscribeToStock method checks if the ISIN is already in the subscriptions list before adding it. If the ISIN is already present, it will not be added again.
    Also the subscription button is disabled when the user enters an already exisitng ISIN

3. What potential performance issues might you face when this app scales with multiple subscriptions? How would you improve the speed and user experience?
    - By using Batch Processing which process incoming WebSocket messages in batches to reduce the overhead of frequent state updates. This is already partially addressed by the bufferTime operator.

---