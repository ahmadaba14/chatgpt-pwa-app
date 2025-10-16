import { FormEvent } from 'react';
import styles from './toolbar.module.css';

type ToolbarProps = {
  addressValue: string;
  onAddressChange: (value: string) => void;
  onSubmitAddress: (event: FormEvent<HTMLFormElement>) => void;
  onReload: () => void;
  onOpenExternal: () => void;
};

export function Toolbar({
  addressValue,
  onAddressChange,
  onSubmitAddress,
  onReload,
  onOpenExternal
}: ToolbarProps) {
  return (
    <form className={styles.toolbar} onSubmit={onSubmitAddress}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Reload tab"
        onClick={onReload}
      >
        ⟳
      </button>
      <div className={styles.addressField}>
        <input
          value={addressValue}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder="Enter a URL"
          aria-label="Tab address"
        />
      </div>
      <button type="submit" className={styles.goButton} aria-label="Go to address">
        Go
      </button>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Open in new window"
        onClick={onOpenExternal}
      >
        ⧉
      </button>
    </form>
  );
}
