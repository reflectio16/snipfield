export type Category = {
  id: number;
  name: string;
  createdAt: string;
};

export type ItemType = "NOTE" | "IMAGE" | "LINK";

export type Item = {
  id: number;
  type: ItemType;
  title: string | null;
  content: string | null;
  url: string | null;
  imagePath: string | null;
  createdAt: string;
  categoryId: number;
};

export type CategoryWithItems = Category & {
  items: Item[];
};
