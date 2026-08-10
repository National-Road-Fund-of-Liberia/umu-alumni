import { randomUUID } from "node:crypto";

import type { NewsArticle } from "@/types/news";
import { slugify } from "@/lib/utils";
import { generateCoverPlaceholder } from "./placeholder-image";

const ARTICLES: Array<
  Pick<NewsArticle, "title" | "excerpt" | "content" | "category" | "status" | "author"> & {
    publishedDaysAgo: number | null;
  }
> = [
  {
    title: "UMU Alumni Association Launches 2026 Scholarship Fund",
    excerpt:
      "The association has opened applications for a new need-based scholarship fund supporting current UMU students in Business, Nursing, and Computer Science.",
    content:
      "The United Methodist University Alumni Association has officially launched its 2026 Scholarship Fund, a need-based initiative aimed at supporting current students in Business Administration, Nursing, and Computer Science. The fund was seeded by contributions from graduating classes spanning four decades and will award its first ten scholarships before the start of the next academic term.\n\nApplications are open to any currently enrolled UMU student with demonstrated financial need and a minimum cumulative GPA of 3.0. The Executive Committee will review applications through the Office of Student Affairs, with awards announced at the association's annual homecoming ceremony.\n\n\"This fund reflects exactly what alumni giving should look like — direct, transparent, and tied to outcomes we can measure,\" said the association's Treasurer, Josephine Kesselly, in announcing the initiative.",
    category: "Announcement",
    status: "published",
    author: "UMU Alumni Communications",
    publishedDaysAgo: 6,
  },
  {
    title: "Class of 2010 Marks 15-Year Reunion in Monrovia",
    excerpt:
      "Over 80 graduates from the Class of 2010 gathered at the UMU campus this month for a weekend of reconnection, campus tours, and a formal gala dinner.",
    content:
      "More than eighty graduates from the Class of 2010 returned to campus this month for their 15-year reunion, marking one of the association's best-attended chapter gatherings in recent years. The weekend opened with a campus tour led by current students, followed by a panel discussion where alumni shared career reflections with graduating seniors.\n\nThe reunion closed with a formal gala dinner at which the class collectively pledged funding toward the renovation of the university's main library reading room — a project expected to break ground later this year.",
    category: "Campus",
    status: "published",
    author: "Miatta Karnley",
    publishedDaysAgo: 18,
  },
  {
    title: "Alumna Dr. Grace Sirleaf Appointed Deputy Minister of Health",
    excerpt:
      "Dr. Grace Sirleaf, a 2005 graduate of the Public Health program, has been appointed Deputy Minister of Health, becoming one of the association's most senior appointees in government.",
    content:
      "Dr. Grace Sirleaf, who earned her Bachelor of Science in Public Health from United Methodist University in 2005, has been appointed Deputy Minister of Health. Dr. Sirleaf previously served as a program coordinator with a leading international health organization before returning to Liberia to lead maternal health initiatives.\n\nThe Alumni Association congratulated Dr. Sirleaf in a statement, noting that her appointment continues a growing trend of UMU graduates taking on senior public service roles across the country.",
    category: "Achievement",
    status: "published",
    author: "UMU Alumni Communications",
    publishedDaysAgo: 32,
  },
  {
    title: "UMU Alumni Association Signs Partnership with Ecobank Liberia",
    excerpt:
      "A new partnership with Ecobank Liberia will offer association members preferential rates on savings products and small business loans.",
    content:
      "The Alumni Association has signed a memorandum of understanding with Ecobank Liberia to offer verified members preferential rates on savings accounts and small business financing. The partnership is part of a broader effort to deliver tangible member benefits beyond networking and events.\n\nMembers will be able to verify their alumni status through the association's front desk starting next month, with banking benefits activated shortly after verification.",
    category: "Partnership",
    status: "published",
    author: "Prince Varney",
    publishedDaysAgo: 45,
  },
  {
    title: "Homecoming 2025 Draws Record Attendance",
    excerpt:
      "This year's homecoming weekend drew alumni from every graduating class since 1994, with record turnout at the Saturday evening banquet.",
    content:
      "Homecoming 2025 drew what organizers are calling record attendance, with alumni traveling from as far as Harper and Voinjama to take part in the weekend's programming. Saturday's banquet featured remarks from the university president and a keynote address from a 1994 graduate now serving as a senior partner at a regional accounting firm.\n\nThe Organizing Secretary's office confirmed that planning for Homecoming 2026 is already underway, with an expanded schedule under consideration.",
    category: "Campus",
    status: "published",
    author: "UMU Alumni Communications",
    publishedDaysAgo: 70,
  },
  {
    title: "Alumni Association Opens Regional Chapter in Buchanan",
    excerpt:
      "A new regional chapter based in Buchanan will give Grand Bassa County alumni a formal structure for local meetups and community projects.",
    content:
      "The Alumni Association has formally chartered a new regional chapter serving Grand Bassa County, based in Buchanan. The chapter's inaugural meeting drew over thirty local alumni and elected an interim steering committee tasked with organizing quarterly meetups and a community outreach project before year end.\n\nAlumni interested in joining or chartering a chapter in their region are encouraged to contact the Secretary General's office.",
    category: "Announcement",
    status: "published",
    author: "Emmanuel Gongloe",
    publishedDaysAgo: 95,
  },
  {
    title: "Six UMU Graduates Recognized in '30 Under 30' Business Leaders List",
    excerpt:
      "Six recent UMU graduates were named to a national '30 Under 30' list recognizing rising business leaders across Liberia.",
    content:
      "Six graduates of United Methodist University, all from the Business Administration and Accounting programs, were recognized in this year's national '30 Under 30' list honoring rising business leaders. The recognitions span sectors including banking, telecommunications, and logistics.\n\nThe Alumni Association plans to host a reception in honor of the six graduates during the next quarterly networking event.",
    category: "Alumni Spotlight",
    status: "published",
    author: "UMU Alumni Communications",
    publishedDaysAgo: 120,
  },
  {
    title: "Annual Giving Campaign Surpasses Target Ahead of Schedule",
    excerpt:
      "The association's annual giving campaign reached its fundraising target six weeks ahead of schedule, driven largely by first-time donors.",
    content:
      "This year's annual giving campaign surpassed its fundraising target six weeks ahead of schedule, with the Treasurer's office reporting a significant increase in first-time donor participation. Funds raised will support the newly launched scholarship fund as well as ongoing library renovation work.\n\nThe association thanked all chapters for their role in the campaign's outreach efforts.",
    category: "Announcement",
    status: "published",
    author: "Josephine Kesselly",
    publishedDaysAgo: 150,
  },
  {
    title: "Draft: Q3 Chapter Performance Review",
    excerpt:
      "Internal draft summarizing chapter activity and engagement metrics for the third quarter, pending Executive Committee review.",
    content:
      "This is an internal draft summarizing chapter activity across all regional chapters for the third quarter, prepared for Executive Committee review ahead of publication.",
    category: "Campus",
    status: "draft",
    author: "UMU Alumni Communications",
    publishedDaysAgo: null,
  },
  {
    title: "Draft: Proposed Changes to Membership Verification",
    excerpt:
      "Draft proposal outlining a streamlined process for verifying alumni status when accessing partner benefits.",
    content:
      "This draft proposes a streamlined membership verification process intended to simplify how alumni access partner benefits such as banking discounts and event pricing. The proposal is under review ahead of formal publication.",
    category: "Announcement",
    status: "draft",
    author: "Alfred Kollie",
    publishedDaysAgo: null,
  },
];

export function generateNews(): NewsArticle[] {
  const now = Date.now();

  return ARTICLES.map((article) => {
    const slug = slugify(article.title.replace(/^Draft:\s*/, ""));
    const publishedAt =
      article.publishedDaysAgo === null
        ? null
        : new Date(now - article.publishedDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    const createdAt = publishedAt ?? new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: randomUUID(),
      title: article.title,
      slug,
      excerpt: article.excerpt,
      content: article.content,
      coverImageUrl: generateCoverPlaceholder(slug, article.category),
      category: article.category,
      status: article.status,
      author: article.author,
      publishedAt,
      createdAt,
      updatedAt: createdAt,
    } satisfies NewsArticle;
  });
}
