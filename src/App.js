import React from 'react';
import './App.css';
import { Container, Navbar } from 'react-bootstrap';
import { useMainContext } from './providers/MainProvider'
import { standardColors } from './constants'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import StateExplorerPage from './pages/StateExplorer'

const Header = () => {
  return (
    <header>
      <Container fluid>
        <Navbar bg="dark" expand="lg">
          <Navbar.Brand href="#home" style={{ color: "white", fontFamily: 'Open Sans, sans-serif', fontSize: '25px' }}>
            COVID STATS <span style={{ color: standardColors[0] }}>U</span>.<span style={{ color: standardColors[1] }}>S</span>.
          </Navbar.Brand>
        </Navbar>
      </Container>
    </header>
  )
}

const App = () => {
  const { totalsError, statesInfoError, dailyDataError } = useMainContext()
  // if (loading) return <p>Loading...</p>;
  if (totalsError || dailyDataError || dailyDataError) {
    return (
      <>
        {JSON.stringify(totalsError) ? <p>{JSON.stringify(totalsError)}</p> : null } 
        {JSON.stringify(statesInfoError) ? <p>{JSON.stringify(statesInfoError)}</p> : null } 
        {JSON.stringify(dailyDataError) ? <p>{JSON.stringify(dailyDataError)}</p> : null } 
      </>
    )
  };

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/state-explorer">
          <StateExplorerPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
