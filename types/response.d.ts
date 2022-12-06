interface Picture {
  id: number;
  url: string;
  favorite_count: number;
  like_count: number;
  favorite?: boolean;
  like?: boolean;
  description: string;
}

interface CollectionType {
  id: number;
  title: string;
  description: string;
  url: string;
}

interface UserType {
  avatar: string;
  nickname: string;
}

interface ErrorType {
  error: string;
}
