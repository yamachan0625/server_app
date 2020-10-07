export type ItemData = {
  rendered_body: string;
  body: string;
  coediting: boolean;
  comments_count: number;
  created_at: string;
  group: any;
  id: string;
  likes_count: number;
  private: boolean;
  reactions_count: number;
  tags: {
    name: string;
    versions: [];
  }[];
  title: string;
  updated_at: string;
  url: string;
  user: {
    description: string;
    facebook_id: string;
    followees_count: number;
    followers_count: number;
    github_login_name: string;
    id: string;
    items_count: number;
    linkedin_id: string;
    location: string;
    name: string;
    organization: string;
    permanent_id: number;
    profile_image_url: string;
    team_only: boolean;
    twitter_screen_name: any;
    website_url: string;
  };
  page_views_count: any;
  stock_count?: number;
  total_like_and_stock?: number;
}[];

export type StockData = {
  description: string;
  facebook_id: string;
  followees_count: number;
  followers_count: number;
  github_login_name: string;
  id: string;
  items_count: number;
  linkedin_id: string;
  location: string;
  name: string;
  organization: string;
  permanent_id: number;
  profile_image_url: string;
  team_only: boolean;
  twitter_screen_name: string;
  website_url: string;
}[];

export type TagData = {
  followers_count: number;
  icon_url: string;
  id: string;
  items_count: number;
};
