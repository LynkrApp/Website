export type UserLink = {
  id: string;
  title: string;
  url: string;
  isSocial?: boolean;
  archived?: boolean;
  sectionId?: string | null;
  [key: string]: any;
};

export type UserSection = {
  id: string;
  name: string;
  visible?: boolean;
  links?: UserLink[];
  [key: string]: any;
};

export type ThemePalette = {
  type?: 'image' | 'gradient' | 'pattern' | 'animated';
  palette?: string[];
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundSize?: string;
  overlay?: string;
  animation?: string;
  [key: string]: any;
};

export type LayoutTheme = {
  alignment?: 'left' | 'center';
  spacing?: 'tight' | 'normal' | 'loose';
  containerWidth?: string;
  displayMode?: 'tabbed' | 'list';
  [key: string]: any;
};

export type TypographyTheme = {
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: string;
  headingWeight?: string;
  bodyWeight?: string;
  [key: string]: any;
};

export type PublicUser = {
  id: string;
  handle: string;
  name?: string;
  bio?: string;
  image?: string;
  buttonStyle?: any;
  buttonStyleTheme?: any;
  themePalette?: ThemePalette;
  layoutTheme?: LayoutTheme;
  typographyTheme?: TypographyTheme;
  [key: string]: any;
};

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  userRole: UserRole;
  isBanned?: boolean;
  session_state?: string | null;
  oauth_token_secret?: string | null;
  oauth_token?: string | null;
  legacyObjectId?: string | null;
  [key: string]: any;
};
