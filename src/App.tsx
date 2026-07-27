import { useState } from 'react'
import {
  Button,
  Heading,
  Tab,
  TabList,
  TabPanel,
} from '@cfpb/design-system-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('one')

  return (
    <main className='demo'>
      <Heading type='slug'>Pattern B — full DS CSS + dsr.css</Heading>
      <p className='demo__intro'>
        Full Design System CSS plus thin{' '}
        <code>@cfpb/design-system-react/dsr.css</code> for Tabs. Do{' '}
        <strong>not</strong> also import <code>index.css</code>.
      </p>

      <section className='demo__section'>
        <Heading type='2'>Tabs</Heading>
        <p className='demo__note'>
          Inactive tabs should look like DSR links (blue, dotted underline).
          The active tab is a gray chip sitting on the baseline.
        </p>
        <TabList>
          <Tab
            id='one'
            value='one'
            isActive={activeTab === 'one'}
            iconLeft='list'
            label='Tab one'
            onClick={(event) => setActiveTab(event.currentTarget.value)}
          />
          <Tab
            id='two'
            value='two'
            isActive={activeTab === 'two'}
            iconLeft='chart'
            label='Tab two'
            onClick={(event) => setActiveTab(event.currentTarget.value)}
          />
          <Tab
            id='three'
            value='three'
            isActive={activeTab === 'three'}
            iconLeft='map'
            label='Tab three'
            onClick={(event) => setActiveTab(event.currentTarget.value)}
          />
        </TabList>
        <TabPanel id={activeTab}>
          <Heading type='4'>Panel {activeTab}</Heading>
        </TabPanel>
      </section>

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
