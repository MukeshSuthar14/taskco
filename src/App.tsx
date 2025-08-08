import { DndProvider } from 'react-dnd'
import Layout from './layouts/Layout'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Projects from './pages/Projects'

function App() {

  return (
    // <DndProvider backend={HTML5Backend}>
      <Layout>
        <Projects />
      </Layout>
    // </DndProvider>
  )
}

export default App
