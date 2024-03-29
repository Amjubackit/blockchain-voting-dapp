# Blockchain Based Voting System

A blockchain based voting dapp created in React and Solidity.

## Setup

### 1. clone git repo

`gh repo clone Amjubackit/blockchain-voting-dapp`

### 2. Install requirements

-   install npm: https://nodejs.org/en/download

-   install truffle
    `npm i truffle`

-   install ganache && ganache client

    ```
    npm install ganache
    https://archive.trufflesuite.com/ganache
    ```

-   Navigate to truffle directory and run (from root)

    ```
    cd truffle
    npm install
    ```

-   Navigate to client directory and run (from root)
    ```
    cd client
    yarn install
    ```

## Start the application

### 1. Setup blockchain instance

Open Ganache client to start blockchain instance.

### 2. Compile & Deploy

`truffle migrate --reset`

### 3. Configure Metamask

-   Unlock Metamask
-   Connect metamask to the local Ethereum blockchain provided by Ganache.
-   Import an account provided by Ganache (Admin will be the first account).

### 4. Run the Front End Application

```powershell
cd client
yarn start
```

Visit URL in your browser: <http://localhost:3000>
