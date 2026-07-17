import { Button, Heading } from '@cfpb/design-system-react'
import './App.css'

function App() {
  return (
    <main className='demo'>
      <Heading type='slug'>Pattern A — DSR CSS only</Heading>
      <p className='demo__intro'>
        Styles from <code>@cfpb/design-system-react/index.css</code>. No full DS
        stylesheet.
      </p>

      <section className='demo__section'>
        <Heading type='2'>Button</Heading>
        <div className='demo__row'>
          <Button label='Primary' onClick={() => {}} />
          <Button
            label='Secondary'
            appearance='secondary'
            onClick={() => {}}
          />
        </div>
      </section>

      <section className='demo__section'>
        <Heading type='2'>Heading</Heading>
        <Heading type='3'>Level 3 heading</Heading>
      </section>
    </main>
  )
}

export default App
