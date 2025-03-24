import { updateUserProfile, getUserProfile, adminUpdateUserProfile } from '../../../lib/users';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const userProfile = await getUserProfile();
      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      if (error.message.includes('logged in')) {
        return res.status(401).json({ error: 'Unauthorized - You must be logged in' });
      }
      
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    // Check for admin update
    const { user_id } = req.query;
    
    try {
      let updatedProfile;
      
      if (user_id) {
        // Admin update for a specific user
        updatedProfile = await adminUpdateUserProfile(user_id, req.body);
      } else {
        // Regular user updating their own profile
        updatedProfile = await updateUserProfile(req.body);
      }
      
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      
      if (error.message.includes('logged in')) {
        return res.status(401).json({ error: 'Unauthorized - You must be logged in' });
      }
      
      if (error.message.includes('Admin')) {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
      }
      
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
