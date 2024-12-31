export interface FeedPost {
  id: string;
  content: string;
  created_at: string;
  profile: {
    name: string;
  };
  feed_post_media: {
    id: string;
    media_type: "image" | "video";
    media_url: string;
  }[];
}