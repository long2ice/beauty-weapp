interface Picture {
  id: number;
  url: string;
  favorite_count: number;
  like_count: number;
  favorite?: boolean;
  like?: boolean;
}

interface CollectionType {
  id: number;
  title: string;
  description: string;
  url: string;
}
