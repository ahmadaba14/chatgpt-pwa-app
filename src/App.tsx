import { FormEvent, useMemo, useState } from 'react';
import { TabBar } from './components/TabBar';
import { Toolbar } from './components/Toolbar';
import styles from './app.module.css';

type ChatTab = {
  id: string;
  title: string;
  url: string;
  version: number;
};

const CHATGPT_URL = 'https://chat.openai.com/';

const generateId = () =>
  (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const createTab = (index: number): ChatTab => ({
  id: generateId(),
  title: `Chat ${index + 1}`,
  url: CHATGPT_URL,
  version: 0
});

const initialTab: ChatTab = {
  id: generateId(),
  title: 'Chat 1',
  url: CHATGPT_URL,
  version: 0
};

export default function App() {
  const [tabs, setTabs] = useState<ChatTab[]>([initialTab]);
  const [activeTabId, setActiveTabId] = useState<string>(initialTab.id);
  const [addressValue, setAddressValue] = useState<string>(initialTab.url);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [activeTabId, tabs]
  );

  const activeIframeKey = useMemo(() => `${activeTab?.id ?? 'none'}-${activeTab?.version ?? 0}`, [activeTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    const nextActive = tabs.find((tab) => tab.id === tabId);
    if (nextActive) {
      setAddressValue(nextActive.url);
    }
  };

  const handleAddTab = () => {
    setTabs((prev) => {
      const next = [...prev, createTab(prev.length)];
      const newTab = next[next.length - 1];
      setActiveTabId(newTab.id);
      setAddressValue(newTab.url);
      return next;
    });
  };

  const handleCloseTab = (tabId: string) => {
    setTabs((prev) => {
      if (prev.length === 1) {
        return prev; // keep at least one tab
      }
      const index = prev.findIndex((tab) => tab.id === tabId);
      if (index === -1) {
        return prev;
      }
      const next = [...prev.slice(0, index), ...prev.slice(index + 1)];
      if (tabId === activeTabId) {
        const fallback = next[Math.max(0, index - 1)];
        setActiveTabId(fallback.id);
        setAddressValue(fallback.url);
      }
      return next;
    });
  };

  const handleReload = () => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, version: tab.version + 1 } : tab
      )
    );
  };

  const handleSubmitAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formattedUrl = normaliseUrl(addressValue);
    setAddressValue(formattedUrl);
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId ? { ...tab, url: formattedUrl, version: tab.version + 1 } : tab
      )
    );
  };

  const handleAddressChange = (value: string) => {
    setAddressValue(value);
  };

  const handleOpenExternal = () => {
    const url = activeTab?.url ?? CHATGPT_URL;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.appShell}>
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onAddTab={handleAddTab}
        onCloseTab={handleCloseTab}
        onSelectTab={handleSelectTab}
      />
      <Toolbar
        addressValue={addressValue}
        onAddressChange={handleAddressChange}
        onSubmitAddress={handleSubmitAddress}
        onReload={handleReload}
        onOpenExternal={handleOpenExternal}
      />
      <main className={styles.stage}>
        {activeTab ? (
          <iframe
            key={activeIframeKey}
            className={styles.iframe}
            src={activeTab.url}
            title={activeTab.title}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
          />
        ) : (
          <div className={styles.emptyState}>
            <h2>No open chats</h2>
            <p>Use the + button above to start a new ChatGPT tab.</p>
          </div>
        )}
        <div className={styles.fallbackMessage}>
          <h2>Having trouble loading ChatGPT?</h2>
          <p>
            ChatGPT may require you to sign in in a separate window. If the embedded view
            stays blank, use the “Open in Window” button to continue your conversation
            in the full ChatGPT interface.
          </p>
          <button type="button" onClick={handleOpenExternal} className={styles.openButton}>
            Open in Window
          </button>
        </div>
      </main>
    </div>
  );
}

function normaliseUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return CHATGPT_URL;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
