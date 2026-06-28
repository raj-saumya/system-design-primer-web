import { getCollection, type CollectionEntry } from "astro:content";

export type Card = CollectionEntry<"primer">;

export type SearchItem = {
  title: string;
  url: string;
  label: string;
  minutes: number;
  excerpt: string;
  tags: string[];
};

export type CategoryGroup = {
  category: string;
  title: string;
  cards: Card[];
};

export type Crumb = {
  name: string;
  url: string;
};

const categoryOrder = ["scalability", "exercises", "object-oriented-design"];

const categoryLabels: Record<string, string> = {
  scalability: "Concepts",
  exercises: "Exercise",
  "object-oriented-design": "OO Design",
};

export const cardSlug = (card: Card) =>
  (card.id.split("/").pop() ?? card.id).replace(/^\d+-/, "");

export const cardUrl = (card: Card) =>
  `/${card.data.category}/${cardSlug(card)}/`;

export const categoryLabel = (category: string) =>
  (categoryLabels[category] ?? category).toUpperCase();

const toPlainText = (body: string) =>
  body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const readingTime = (card: Card) =>
  Math.max(
    1,
    Math.round(
      toPlainText(card.body ?? "")
        .split(" ")
        .filter(Boolean).length / 200,
    ),
  );

export const excerpt = (card: Card, maxLength = 160) => {
  const text = toPlainText(card.body ?? "");
  return text.length > maxLength
    ? text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…"
    : text;
};

export const toSearchItem = (card: Card): SearchItem => ({
  title: card.data.title,
  url: cardUrl(card),
  label: categoryLabel(card.data.category),
  minutes: readingTime(card),
  excerpt: excerpt(card),
  tags: card.data.tags,
});

export const allCards = async (): Promise<Card[]> => {
  const cards = await getCollection("primer");
  return cards.sort((first, second) => {
    const firstOrder = categoryOrder.indexOf(first.data.category);
    const secondOrder = categoryOrder.indexOf(second.data.category);
    return firstOrder === secondOrder
      ? first.data.order - second.data.order
      : firstOrder - secondOrder;
  });
};

export const groupedByCategory = async (): Promise<CategoryGroup[]> => {
  const groups = new Map<string, CategoryGroup>();
  for (const card of await allCards()) {
    const group = groups.get(card.data.category) ?? {
      category: card.data.category,
      title: card.data.categoryTitle,
      cards: [],
    };
    group.cards.push(card);
    groups.set(card.data.category, group);
  }
  return [...groups.values()];
};

export const breadcrumbLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});
