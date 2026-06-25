import { Button, Heading } from '@cfpb/design-system-react'
import './App.css'

function App() {
  return (
    <main className='demo'>
      <Heading type='slug'>Design System React</Heading>
      <p className='demo__intro'>
        Local demo for <code>@cfpb/design-system-react</code> components.
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
