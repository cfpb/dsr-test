import { Button, Heading } from '@cfpb/design-system-react'
import './App.css'

function App() {
  return (
    <main className='demo'>
      <Heading type='slug'>Pattern B — full DS CSS</Heading>
      <p className='demo__intro'>
        DSR components only; styles from{' '}
        <code>@cfpb/cfpb-design-system</code>. No{' '}
        <code>@cfpb/design-system-react/index.css</code>.
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

      <section className='demo__section'>
        <Heading type='2'>Hand-rolled DS markup</Heading>
        <p className='demo__intro'>
          Pattern B covers full DS modules (lists, expandables, …) that are not
          in the DSR CSS barrel — useful when mixing DSR with plain DS classes.
        </p>
        <ul className='m-list'>
          <li className='m-list_item'>First item</li>
          <li className='m-list_item'>Second item</li>
          <li className='m-list_item'>Third item</li>
        </ul>
      </section>
    </main>
  )
}

export default App
