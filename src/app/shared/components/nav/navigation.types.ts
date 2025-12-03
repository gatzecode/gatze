import { WritableSignal } from '@angular/core';

export type NavAppearance = 'classic' |'dense';

export interface NavItemType {
  id: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  link?: string;
  type: 'basic' | 'collapsable' | 'group' | 'divider' | 'spacer';
  children?: NavItemType[];
  badge?: {
    title: string;
    classes?: string;
  };
  disabled?: boolean;
  hidden?: boolean;
  exactMatch?: boolean;
  tooltip?: string;
  externalLink?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  expanded?: boolean; // initial hint (optional)
}

// Internal representation that keeps a WritableSignal for expanded state
export interface InternalNavItem extends NavItemType {
  _expanded: WritableSignal<boolean>;
  children?: InternalNavItem[];
}
