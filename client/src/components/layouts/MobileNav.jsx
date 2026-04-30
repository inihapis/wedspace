/**
 * Mobile Navigation Layout Component
 * Mobile bottom navigation dengan 5 items
 * Item dengan center: true ditampilkan di tengah dengan styling khusus
 */

import { mainNavItems } from '../../data/navigation'

export default function MobileNav({ currentView, setCurrentView }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mobile-nav">
      <div className="flex items-end px-2">
        {mainNavItems.map((item) => {
          const isActive = currentView === item.id
          const IconComponent = item.icon

          // Center item (dengan center: true)
          if (item.center) {
            return (
              <div key={item.id} className="flex-1 flex justify-center mb-2">
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`nav-center-btn place-items-center ${
                    isActive ? 'nav-center-active' : 'nav-center-inactive'
                  }`}
                  aria-label={item.label}
                >
                  <IconComponent size={22} className="text-white" />
                </button>
              </div>
            )
          }

          // Side items
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`nav-item ${
                isActive ? 'text-primary' : 'text-text-subtle'
              }`}
            >
              {/* Active bar indicator */}
              {isActive && <div className="nav-item-active-bar" />}
              <div
                className={`nav-item-icon hover:bg-accent-light transition-all duration-300 ${
                  isActive ? 'bg-accent-light' : 'bg-transparent'
                }`}
              >
                <IconComponent size={19} />
              </div>
              <span
                className={`nav-item-label ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-text-subtle font-normal'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
