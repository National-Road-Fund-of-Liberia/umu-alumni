import { randomUUID } from "node:crypto";

import { DEGREE_TYPES, PROGRAMS, type Alumni, type Program } from "@/types/alumni";
import { generateInitialsAvatar } from "./placeholder-image";
import { FEMALE_FIRST_NAMES, LAST_NAMES, LIBERIAN_CITIES, MALE_FIRST_NAMES, STREET_NAMES } from "./names";
import { createRng, pick, randomInt } from "./rng";

const PROGRAM_OCCUPATIONS: Record<Program, string[]> = {
  "Business Administration": [
    "Bank Manager", "Business Consultant", "Operations Manager", "Entrepreneur",
    "Financial Analyst", "Marketing Manager", "Human Resources Manager", "Procurement Officer",
  ],
  "Computer Science": [
    "Software Engineer", "IT Administrator", "Systems Analyst", "Network Engineer",
    "Data Analyst", "Web Developer",
  ],
  Nursing: [
    "Registered Nurse", "Nurse Supervisor", "Public Health Nurse", "Clinical Officer", "Midwife",
  ],
  Theology: [
    "Pastor", "Chaplain", "Church Administrator", "Missionary", "Youth Ministry Coordinator",
  ],
  Education: [
    "High School Teacher", "School Principal", "Curriculum Officer", "University Lecturer",
    "Education Program Officer",
  ],
  Agriculture: [
    "Agricultural Officer", "Farm Manager", "Agronomist", "Extension Officer", "Agribusiness Consultant",
  ],
  "Social Work": [
    "Social Worker", "Case Manager", "Community Development Officer", "Program Officer",
    "Child Protection Officer",
  ],
  Accounting: [
    "Accountant", "Auditor", "Tax Consultant", "Finance Officer", "Chief Financial Officer",
  ],
  "Mass Communication": [
    "Journalist", "Broadcast Producer", "Public Relations Officer", "Communications Officer", "News Editor",
  ],
  "Public Health": [
    "Public Health Officer", "Epidemiologist", "Health Program Coordinator", "Health Educator",
    "Environmental Health Officer",
  ],
};

const ORGANIZATIONS = [
  "Central Bank of Liberia", "Ministry of Health", "Ministry of Education", "LoneStar Cell MTN",
  "Orange Liberia", "ArcelorMittal Liberia", "Liberia Revenue Authority", "UNICEF Liberia",
  "World Bank Group", "Ecobank Liberia", "United Bank for Africa", "Ministry of Agriculture",
  "Firestone Liberia", "Liberia Water and Sewer Corporation", "Liberia Electricity Corporation",
  "John F. Kennedy Medical Center", "Catholic Hospital", "USAID Liberia", "Deloitte Liberia",
  "PwC Liberia", "Liberia Telecommunications Authority", "National Port Authority",
  "Liberia Broadcasting System", "United Methodist Church Liberia", "Africell Liberia",
  "Monrovia City Corporation", "Self-Employed / Private Practice",
] as const;

const BIO_TEMPLATES = [
  (p: { pronoun: string; name: string; degree: string; program: string; year: number; occupation: string; org: string }) =>
    `${p.name} graduated from United Methodist University in ${p.year} with a ${p.degree} in ${p.program}. Since then, ${p.pronoun} has built a career as a ${p.occupation} at ${p.org}, and remains an active member of the UMU alumni community.`,
  (p: { pronoun: string; name: string; degree: string; program: string; year: number; occupation: string; org: string }) =>
    `A ${p.year} graduate of the ${p.program} program, ${p.name} currently serves as a ${p.occupation} at ${p.org}. ${p.pronoun[0].toUpperCase()}${p.pronoun.slice(1)} credits UMU with laying the foundation for a career built on discipline and service.`,
  (p: { pronoun: string; name: string; degree: string; program: string; year: number; occupation: string; org: string }) =>
    `${p.name} earned a ${p.degree} in ${p.program} from United Methodist University in ${p.year}. Today, ${p.pronoun} works as a ${p.occupation} at ${p.org} and regularly mentors current UMU students in the field.`,
];

function buildEmail(firstName: string, lastName: string, index: number): string {
  const suffix = index > 0 ? index : "";
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@gmail.com`;
}

function buildPhone(rng: () => number): string {
  const prefix = pick(rng, ["77", "88", "55", "20"]);
  const rest = randomInt(rng, 1000000, 9999999);
  return `+231 ${prefix} ${String(rest).slice(0, 3)} ${String(rest).slice(3)}`;
}

function buildAddress(rng: () => number): string {
  const number = randomInt(rng, 1, 240);
  const street = pick(rng, STREET_NAMES);
  const city = pick(rng, LIBERIAN_CITIES);
  return `${number} ${street}, ${city}, Liberia`;
}

export function generateAlumni(count: number, seed = 2026): Alumni[] {
  const rng = createRng(seed);
  const usedEmails = new Map<string, number>();

  return Array.from({ length: count }, (_, index) => {
    const isMale = rng() > 0.5;
    const firstName = pick(rng, isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES);
    const lastName = pick(rng, LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;
    const program = pick(rng, PROGRAMS);
    const degree = pick(rng, DEGREE_TYPES);
    const graduationYear = randomInt(rng, 2000, 2025);
    const occupation = pick(rng, PROGRAM_OCCUPATIONS[program]);
    const organization = pick(rng, ORGANIZATIONS);
    const pronoun = isMale ? "he" : "she";
    const bioTemplate = pick(rng, BIO_TEMPLATES);

    const emailKey = `${firstName}.${lastName}`.toLowerCase();
    const occurrence = usedEmails.get(emailKey) ?? 0;
    usedEmails.set(emailKey, occurrence + 1);

    const createdAt = new Date(2024, randomInt(rng, 0, 11), randomInt(rng, 1, 28)).toISOString();

    return {
      id: randomUUID(),
      firstName,
      lastName,
      photoUrl: generateInitialsAvatar(fullName),
      degree,
      program,
      graduationYear,
      occupation,
      organization,
      biography: bioTemplate({
        pronoun,
        name: fullName,
        degree,
        program,
        year: graduationYear,
        occupation,
        org: organization,
      }),
      email: buildEmail(firstName, lastName, occurrence),
      phone: buildPhone(rng),
      address: buildAddress(rng),
      studentId: `UMU-${graduationYear}-${String(randomInt(rng, 100, 999))}${index}`,
      createdAt,
      updatedAt: createdAt,
    } satisfies Alumni;
  });
}
