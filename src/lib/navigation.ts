import { client } from './sanity';

export interface Post {
  title: string;
  slug: string;
  order: number;
}

export interface Section {
  _id: string;
  title: string;
  order: number;
  parent?: { _id: string };
  subSections: Section[];
  posts: Post[];
}

export async function getNavigationTree(): Promise<Section[]> {
  const allSections: Section[] = await client.fetch(`
    *[_type == "section"] | order(order asc) {
      _id,
      title,
      order,
      "parent": parent->{ _id },
      "posts": *[_type == "post" && references(^._id)] | order(order asc) {
        title,
        "slug": slug.current,
        order
      }
    }
      }
    }
  `, {}, { next: { tags: ['content'] } });

  if (!allSections) return [];

  const buildTree = (parentId: string | null = null): Section[] => {
    return allSections
      .filter(s => (parentId ? s.parent?._id === parentId : !s.parent))
      .map(s => ({
        ...s,
        subSections: buildTree(s._id)
      }));
  };

  return buildTree();
}

export async function getFlattenedArticles(): Promise<Post[]> {
  const tree = await getNavigationTree();
  const articles: Post[] = [];

  const traverse = (node: Section) => {
    articles.push(...node.posts);
    node.subSections.forEach(traverse);
  };

  tree.forEach(traverse);
  return articles;
}
