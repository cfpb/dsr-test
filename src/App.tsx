import { useState } from 'react'
import { Button, Heading, Pagination } from '@cfpb/design-system-react'
import './App.css'

function App() {
  const [page, setPage] = useState(2)

  return (
    <main className='demo'>
      <Heading type='slug'>Broken on DSR main</Heading>
      <p className='demo__intro'>
        This app uses Pattern A (<code>@cfpb/design-system-react/index.css</code>
        ) against current DSR <code>main</code>. Expect slug and buttons to look
        wrong or unstyled. Compare with{' '}
        <code>demo/pattern-a-dsr-css</code> (fixed barrel from PR #618).
      </p>

      <section className='demo__section'>
        <Heading type='2'>Slug heading</Heading>
        <p className='demo__intro'>
          Emits <code>.m-slug-header</code> but DSR main never loads DS{' '}
          <code>slug-header</code> styles into <code>index.css</code>.
        </p>
        <Heading type='slug'>Expected: teal bar + uppercase slug</Heading>
      </section>

      <section className='demo__section'>
        <Heading type='2'>Button</Heading>
        <p className='demo__intro'>
          Emits <code>.a-btn</code> but component button CSS is not in the
          bundled stylesheet on DSR main.
        </p>
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
        <Heading type='2'>Pagination (inconsistent exception)</Heading>
        <p className='demo__intro'>
          May look closer to correct because the component file deep-imports{' '}
          <code>@cfpb/cfpb-design-system/.../pagination.scss</code> — the
          anti-pattern PR #618 removes in favor of a shared style barrel.
        </p>
        <Pagination
          page={page}
          pageCount={5}
          onClickPrevious={() => setPage(p => Math.max(1, p - 1))}
          onClickNext={() => setPage(p => Math.min(5, p + 1))}
          onClickGo={value => setPage(value)}
        />
      </section>
    </main>
  )
}

export default App
