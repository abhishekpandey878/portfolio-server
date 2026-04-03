import {
  getStoredSection,
  getStoredProfile,
  isValidSection,
  updateStoredSection,
} from '../repositories/profile.repository.js';

export async function getProfile(_request, response) {
  try {
    const profile = await getStoredProfile();
    response.json(profile);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch profile.', error: error.message });
  }
}

export async function getProfileSection(request, response) {
  const { section } = request.params;

  if (!isValidSection(section)) {
    return response.status(404).json({ message: 'Unknown profile section.' });
  }

  try {
    const data = await getStoredSection(section);
    return response.json({ section, data });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to fetch section.', error: error.message });
  }
}

export async function updateProfileSection(request, response) {
  const { section } = request.params;

  if (!isValidSection(section)) {
    return response.status(404).json({ message: 'Unknown profile section.' });
  }

  try {
    const data = await updateStoredSection(section, request.body);
    return response.json({
      message: `${section} section updated successfully.`,
      section,
      data
    });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to update section.', error: error.message });
  }
}
