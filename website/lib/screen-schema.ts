export interface LayoutSpec {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface SectionSpec {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly layout: LayoutSpec;
  readonly components: readonly string[];
}

export interface GridSpec {
  readonly columns: number;
  readonly rows: number;
  readonly column_width: number;
  readonly gutter: number;
  readonly margin: number;
}

export interface ScreenSpec {
  readonly id: string;
  readonly name: string;
  readonly route: string;
  readonly summary: string;
  readonly grid: GridSpec;
  readonly sections: readonly SectionSpec[];
  readonly primary_actions: readonly string[];
  readonly references: readonly string[];
}
