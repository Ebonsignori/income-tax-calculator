export type YearPageParams = {
  year: string;
};

export type YearPageProps = {
  params: YearPageParams;
};

export type StatePageParams = {
  year: string;
  state: string;
  city?: string;
};

export type StatePageProps = {
  params: StatePageParams;
};

export type CityPageParams = {
  year: string;
  state: string;
  city: string;
};

export type CityPageProps = {
  params: CityPageParams;
};
