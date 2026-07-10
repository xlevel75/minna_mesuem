import { BottomNav } from './components/BottomNav'
import { useApp } from './store/appStore'
import { MapTab } from './tabs/MapTab'
import { EventsTab } from './tabs/EventsTab'
import { FestivalsTab } from './tabs/FestivalsTab'
import './App.css'

function App() {
  const { tab, setTab } = useApp()

  return (
    <div className="app-shell">
      {/* Keep every tab mounted so map state / scroll position survive switches. */}
      <div className="app-body">
        <div hidden={tab !== 'map'} className="tab-pane">
          <MapTab active={tab === 'map'} />
        </div>
        <div hidden={tab !== 'events'} className="tab-pane">
          <EventsTab />
        </div>
        <div hidden={tab !== 'festivals'} className="tab-pane">
          <FestivalsTab />
        </div>
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
