import React from 'react'
import SocialShareButtons from '../components/SocialShareButtons'
import ResponsiveDataViewer from '../components/ResponsiveDataViewer'
import Charts from '../components/Charts'
import { Container, Jumbotron } from 'react-bootstrap'

const PageJumboTron = () => (
    <Container>
      <Jumbotron>
        <p className="lead"><strong>Welcome to COVID Stats U.S.</strong></p>
        <p className="lead">This project started out as my own attempt to understand what the COVID situation looked like in the U.S. and rapidly grew into a tool that I hope you will find useful. This is a work in progress so stay-tuned for updates.</p>
        <p className="lead">The charts represent the latest data available thanks to the hard work of the folks at <a href="http://www.covidtracking.com/">covidtracking.com</a>. If anything looks off, make sure to check their <a href="https://covidtracking.com/data/"> notes for that state</a>.</p>
        <p className="lead">Clicking on the data for any state will highlight that state in all graphs.</p>
        <p className="lead">If you have questions or comments <a href="https://twitter.com/TylerMorganMe"> feel free to reach out</a>.</p>
        <p className="lead">Enjoy and please share!</p>
        <SocialShareButtons />
      </Jumbotron>
    </Container>
  )

const HomePage = () => {
  return (
    <main>
      <PageJumboTron />
      <Charts />
      <ResponsiveDataViewer />
    </main>
  )
}

export default HomePage