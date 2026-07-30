import { useState } from 'react'
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Expandable,
  FooterCfGov,
  Header,
  Heading,
  Hero,
  Label,
  Layout,
  Link,
  List,
  Paragraph,
  SecondaryNav,
  SkipNav,
  Tab,
  TabList,
  TabPanel,
  TextInput,
  WellContent,
} from '@cfpb/design-system-react'
import './App.css'

const headerLinks = [
  <Link key='components' to='#components' label='Components' />,
  <Link key='patterns' to='#patterns' label='Patterns' />,
  <Link key='forms' to='#forms' label='Forms' />,
  <Link
    key='docs'
    to='https://cfpb.github.io/design-system-react/'
    label='Storybook'
  />,
]

const sidebarNav = [
  {
    label: 'On this page',
    children: [
      { to: '#components', label: 'Components', isActive: true },
      { to: '#patterns', label: 'Patterns' },
      { to: '#forms', label: 'Forms' },
      { to: '#about', label: 'About this demo' },
    ],
  },
]

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [wantsUpdates, setWantsUpdates] = useState(false)

  return (
    <>
      <SkipNav href='#main' />
      <Header
        href='https://www.consumerfinance.gov'
        links={headerLinks}
      />

      <Layout.Main id='main' layout='2-1'>
        <Hero
          heading='Design System React in action'
          subheading='A standalone Vite app that loads @cfpb/design-system-react the same way a new consumerfinance.gov experience would — Pattern A with one stylesheet.'
          backgroundColor='#d4e7e6'
          image='https://cfpb.github.io/design-system/images/uploads/design_system_illustration_hero_example.png'
          imageAltText='Abstract illustration of the CFPB Design System'
        />

        <Layout.Wrapper>
          <Layout.Content>
            <Alert
              status='info'
              message='This page is a consumer demo, not an official consumerfinance.gov page.'
            >
              It exercises published DSR components together — Header, Hero,
              Layout, Tabs, forms, Expandable, Well, and Footer — outside
              Storybook.
            </Alert>

            <section id='components' className='page-section'>
              <Heading type='2'>Start with familiar building blocks</Heading>
              <Paragraph>
                Buttons, headings, lists, and alerts ship with Design System
                styles via <code>@cfpb/design-system-react/index.css</code>. No
                separate Design System CSS import is required for Pattern A.
              </Paragraph>

              <div className='demo-row'>
                <Button label='Primary action' onClick={() => {}} />
                <Button
                  label='Secondary'
                  appearance='secondary'
                  onClick={() => {}}
                />
                <Button label='Text link style' isLink onClick={() => {}} />
              </div>

              <List>
                <li>Greenfield React apps can start with Pattern A alone.</li>
                <li>
                  Existing CFPB apps that already load full Design System CSS
                  should use Pattern B and <code>dsr.css</code> instead.
                </li>
                <li>
                  Storybook in DSR compiles the same Pattern A source stack via{' '}
                  <code>entry-styles.ts</code>.
                </li>
              </List>
            </section>

            <Divider />

            <section id='patterns' className='page-section'>
              <Heading type='2'>Compose page patterns</Heading>
              <Paragraph>
                Tabs, expandables, and wells help organize denser content the
                way browse and learn pages do on consumerfinance.gov.
              </Paragraph>

              <Heading type='3'>Tabs</Heading>
              <TabList>
                <Tab
                  id='overview'
                  value='overview'
                  label='Overview'
                  isActive={activeTab === 'overview'}
                  onClick={(event) => setActiveTab(event.currentTarget.value)}
                />
                <Tab
                  id='layout'
                  value='layout'
                  label='Layout'
                  isActive={activeTab === 'layout'}
                  onClick={(event) => setActiveTab(event.currentTarget.value)}
                />
                <Tab
                  id='footer'
                  value='footer'
                  label='Footer'
                  isActive={activeTab === 'footer'}
                  onClick={(event) => setActiveTab(event.currentTarget.value)}
                />
              </TabList>
              <TabPanel id={activeTab}>
                {activeTab === 'overview' && (
                  <Paragraph>
                    Inactive tabs use DSR link chrome (blue, dotted underline).
                    The active tab is a gray chip on the baseline — the same
                    treatment as Storybook.
                  </Paragraph>
                )}
                {activeTab === 'layout' && (
                  <Paragraph>
                    This page uses <code>Layout.Main</code>,{' '}
                    <code>Layout.Wrapper</code>, <code>Layout.Content</code>,
                    and <code>Layout.Sidebar</code> with a 2-1 column split.
                  </Paragraph>
                )}
                {activeTab === 'footer' && (
                  <Paragraph>
                    The footer below is <code>FooterCfGov</code>, the packaged
                    consumerfinance.gov footer composition.
                  </Paragraph>
                )}
              </TabPanel>

              <Heading type='3'>Expandable</Heading>
              <Expandable header='How is CSS loaded in this demo?'>
                <Paragraph>
                  <code>src/main.tsx</code> imports{' '}
                  <code>@cfpb/design-system-react/index.css</code> (Pattern A).
                  That single file includes fonts, curated Design System
                  modules, and DSR-authored styles such as Tabs.
                </Paragraph>
              </Expandable>

              <WellContent
                heading='Need the full Design System?'
                text='If your app already compiles @cfpb/cfpb-design-system CSS, switch to Pattern B: keep that stylesheet and import @cfpb/design-system-react/dsr.css for Tabs and other React-only rules.'
                links={[
                  <Link
                    key='readme'
                    to='https://github.com/cfpb/design-system-react#pattern-b-full-ds-css--thin-dsrcss-existing-cfpb-apps'
                    label='Read Pattern B docs'
                  />,
                ]}
              />
            </section>

            <Divider />

            <section id='forms' className='page-section'>
              <Heading type='2'>Collect a little input</Heading>
              <Paragraph>
                Form controls use the same Design System classes as production
                CFPB forms.
              </Paragraph>

              <div className='form-stack'>
                <div className='m-form-field'>
                  <Label htmlFor='newsletter-email'>Email address</Label>
                  <TextInput
                    id='newsletter-email'
                    name='newsletter-email'
                    type='email'
                    value={newsletterEmail}
                    onChange={(event) =>
                      setNewsletterEmail(event.currentTarget.value)
                    }
                    placeholder='you@example.com'
                  />
                </div>
                <Checkbox
                  id='newsletter-opt-in'
                  label='Send me updates about Design System React'
                  checked={wantsUpdates}
                  onChange={(event) =>
                    setWantsUpdates(event.currentTarget.checked)
                  }
                />
                <Button label='Submit (demo only)' onClick={() => {}} />
              </div>
            </section>

            <Divider />

            <section id='about' className='page-section'>
              <Heading type='2'>About this demo</Heading>
              <Paragraph>
                <strong>dsr-test</strong> is a kitchen-sink Vite consumer for{' '}
                <code>@cfpb/design-system-react</code>. It exists to prove that
                published components work together in a standalone app — not
                only inside Storybook.
              </Paragraph>
              <div className='demo-row'>
                <Link
                  to='https://github.com/cfpb/design-system-react'
                  label='design-system-react on GitHub'
                />
                <Link
                  to='https://cfpb.github.io/design-system-react/'
                  label='DSR Storybook'
                />
                <Link
                  to='https://cfpb.github.io/design-system/'
                  label='Design System docs'
                />
              </div>
            </section>
          </Layout.Content>

          <Layout.Sidebar>
            <SecondaryNav items={sidebarNav} ariaLabel='On this page' />
          </Layout.Sidebar>
        </Layout.Wrapper>
      </Layout.Main>

      <FooterCfGov />
    </>
  )
}

export default App
