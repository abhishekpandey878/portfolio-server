import { Profile } from '../models/Profile.js';
import { profileSeed } from '../data/profile.seed.js';

const collectionSections = new Set([
  'links',
  'skills',
  'experience',
  'projects',
  'education'
]);

const singleSections = new Set(['profile', 'about', 'contact']);

function cloneSeed() {
  return JSON.parse(JSON.stringify(profileSeed));
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeStringArray(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((value) => normalizeString(value)).filter(Boolean);
}

function sanitizeLink(link = {}) {
  return {
    label: normalizeString(link.label),
    url: normalizeString(link.url)
  };
}

function sanitizeExperienceItem(item = {}) {
  return {
    role: normalizeString(item.role),
    company: normalizeString(item.company),
    period: normalizeString(item.period),
    description: normalizeString(item.description)
  };
}

function sanitizeProjectItem(item = {}) {
  return {
    name: normalizeString(item.name),
    stack: normalizeStringArray(item.stack),
    description: normalizeString(item.description),
    link: normalizeString(item.link)
  };
}

function sanitizeEducationItem(item = {}) {
  return {
    degree: normalizeString(item.degree),
    institution: normalizeString(item.institution),
    period: normalizeString(item.period)
  };
}

function sanitizeSectionTitles(sectionTitles = {}) {
  const defaults = cloneSeed().sectionTitles;

  return {
    about: normalizeString(sectionTitles.about) || defaults.about,
    skills: normalizeString(sectionTitles.skills) || defaults.skills,
    links: normalizeString(sectionTitles.links) || defaults.links,
    experience: normalizeString(sectionTitles.experience) || defaults.experience,
    projects: normalizeString(sectionTitles.projects) || defaults.projects,
    education: normalizeString(sectionTitles.education) || defaults.education,
    contact: normalizeString(sectionTitles.contact) || defaults.contact
  };
}

function sanitizeProfile(payload = {}) {
  return {
    name: normalizeString(payload.name),
    headline: normalizeString(payload.headline),
    location: normalizeString(payload.location),
    email: normalizeString(payload.email),
    phone: normalizeString(payload.phone),
    summary: normalizeString(payload.summary),
    profilePhoto: normalizeString(payload.profilePhoto),
    resumePath: normalizeString(payload.resumePath),
    socialLinks: Array.isArray(payload.socialLinks) ? payload.socialLinks.map(sanitizeLink) : [],
    highlights: normalizeStringArray(payload.highlights),
    skills: normalizeStringArray(payload.skills),
    sectionTitles: sanitizeSectionTitles(payload.sectionTitles),
    experience: Array.isArray(payload.experience)
      ? payload.experience.map(sanitizeExperienceItem)
      : [],
    projects: Array.isArray(payload.projects) ? payload.projects.map(sanitizeProjectItem) : [],
    education: Array.isArray(payload.education) ? payload.education.map(sanitizeEducationItem) : []
  };
}

function sanitizeSection(section, payload = {}) {
  switch (section) {
    case 'profile':
      return {
        name: normalizeString(payload.name),
        headline: normalizeString(payload.headline),
        location: normalizeString(payload.location),
        email: normalizeString(payload.email),
        phone: normalizeString(payload.phone),
        profilePhoto: normalizeString(payload.profilePhoto),
        resumePath: normalizeString(payload.resumePath)
      };
    case 'about':
      return {
        summary: normalizeString(payload.summary),
        highlights: normalizeStringArray(payload.highlights),
        sectionTitles: {
          about: normalizeString(payload.sectionTitles?.about),
          contact: normalizeString(payload.sectionTitles?.contact)
        }
      };
    case 'contact':
      return {
        email: normalizeString(payload.email),
        phone: normalizeString(payload.phone),
        resumePath: normalizeString(payload.resumePath),
        sectionTitles: {
          contact: normalizeString(payload.sectionTitles?.contact)
        }
      };
    case 'skills':
      return {
        skills: normalizeStringArray(payload.skills),
        sectionTitles: {
          skills: normalizeString(payload.sectionTitles?.skills)
        }
      };
    case 'links':
      return {
        socialLinks: Array.isArray(payload.socialLinks) ? payload.socialLinks.map(sanitizeLink) : [],
        sectionTitles: {
          links: normalizeString(payload.sectionTitles?.links)
        }
      };
    case 'experience':
      return {
        experience: Array.isArray(payload.experience)
          ? payload.experience.map(sanitizeExperienceItem)
          : [],
        sectionTitles: {
          experience: normalizeString(payload.sectionTitles?.experience)
        }
      };
    case 'projects':
      return {
        projects: Array.isArray(payload.projects) ? payload.projects.map(sanitizeProjectItem) : [],
        sectionTitles: {
          projects: normalizeString(payload.sectionTitles?.projects)
        }
      };
    case 'education':
      return {
        education: Array.isArray(payload.education) ? payload.education.map(sanitizeEducationItem) : [],
        sectionTitles: {
          education: normalizeString(payload.sectionTitles?.education)
        }
      };
    default:
      throw new Error('Unknown section.');
  }
}

function mergeSectionTitles(currentTitles = {}, incomingTitles = {}) {
  return sanitizeSectionTitles({
    ...currentTitles,
    ...Object.fromEntries(
      Object.entries(incomingTitles).filter(([, value]) => normalizeString(value))
    )
  });
}

function shapeSectionResponse(section, profile) {
  switch (section) {
    case 'profile':
      return {
        name: profile.name,
        headline: profile.headline,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        profilePhoto: profile.profilePhoto,
        resumePath: profile.resumePath
      };
    case 'about':
      return {
        summary: profile.summary,
        highlights: profile.highlights,
        sectionTitles: {
          about: profile.sectionTitles.about
        }
      };
    case 'contact':
      return {
        email: profile.email,
        phone: profile.phone,
        resumePath: profile.resumePath,
        sectionTitles: {
          contact: profile.sectionTitles.contact
        }
      };
    case 'skills':
      return {
        skills: profile.skills,
        sectionTitles: {
          skills: profile.sectionTitles.skills
        }
      };
    case 'links':
      return {
        socialLinks: profile.socialLinks,
        sectionTitles: {
          links: profile.sectionTitles.links
        }
      };
    case 'experience':
      return {
        experience: profile.experience,
        sectionTitles: {
          experience: profile.sectionTitles.experience
        }
      };
    case 'projects':
      return {
        projects: profile.projects,
        sectionTitles: {
          projects: profile.sectionTitles.projects
        }
      };
    case 'education':
      return {
        education: profile.education,
        sectionTitles: {
          education: profile.sectionTitles.education
        }
      };
    default:
      throw new Error('Unknown section.');
  }
}

async function ensureProfileDocument() {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create(sanitizeProfile(cloneSeed()));
  }

  return profile;
}

export function isValidSection(section) {
  return singleSections.has(section) || collectionSections.has(section);
}

export async function getStoredProfile() {
  const profile = await ensureProfileDocument();
  return profile.toObject();
}

export async function getStoredSection(section) {
  if (!isValidSection(section)) {
    return null;
  }

  const profile = await ensureProfileDocument();
  return shapeSectionResponse(section, profile.toObject());
}

export async function updateStoredSection(section, payload) {
  if (!isValidSection(section)) {
    return null;
  }

  const profile = await ensureProfileDocument();
  const sanitizedSection = sanitizeSection(section, payload);

  if (sanitizedSection.sectionTitles) {
    profile.sectionTitles = mergeSectionTitles(
      profile.sectionTitles?.toObject?.() || profile.sectionTitles,
      sanitizedSection.sectionTitles
    );
    delete sanitizedSection.sectionTitles;
  }

  Object.assign(profile, sanitizedSection);
  await profile.save();

  return shapeSectionResponse(section, profile.toObject());
}
