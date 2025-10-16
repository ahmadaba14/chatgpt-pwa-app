import styles from './tab-bar.module.css';

type Tab = {
  id: string;
  title: string;
};

type TabBarProps = {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onAddTab: () => void;
};

export function TabBar({ tabs, activeTabId, onSelectTab, onCloseTab, onAddTab }: TabBarProps) {
  return (
    <header className={styles.wrapper}>
      <nav className={styles.tabs} aria-label="ChatGPT sessions">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
            onClick={() => onSelectTab(tab.id)}
            aria-selected={tab.id === activeTabId}
            role="tab"
          >
            <span className={styles.title}>{tab.title}</span>
            <span className={styles.close} role="button" aria-label={`Close ${tab.title}`} onClick={(event) => {
              event.stopPropagation();
              onCloseTab(tab.id);
            }}>
              ×
            </span>
          </button>
        ))}
      </nav>
      <button type="button" className={styles.add} onClick={onAddTab} aria-label="Add tab">
        +
      </button>
    </header>
  );
}
