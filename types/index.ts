// Central place to define and export app-wide types.

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



