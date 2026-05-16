import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database/db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Get all companies for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;
    
    const companies = await db.all(`
      SELECT c.*, COUNT(a.id) as applicationCount
      FROM companies c
      LEFT JOIN applications a ON c.id = a.companyId
      WHERE c.userId = ?
      GROUP BY c.id
      ORDER BY c.name ASC
    `, [userId]);
    
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single company
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;
    const { id } = req.params;
    
    const company = await db.get('SELECT * FROM companies WHERE id = ? AND userId = ?', [id, userId]);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Get applications for this company
    const applications = await db.all(
      'SELECT * FROM applications WHERE companyId = ? ORDER BY createdAt DESC',
      [id]
    );
    
    res.json({ ...company, applications });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create company
router.post('/', async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;
    const { name, website, location, industry, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }
    
    const companyId = uuidv4();
    
    await db.run(`
      INSERT INTO companies (id, name, website, location, industry, notes, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [companyId, name, website, location, industry, notes, userId]);
    
    const company = await db.get('SELECT * FROM companies WHERE id = ?', [companyId]);
    res.status(201).json(company);
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update company
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, website, location, industry, notes } = req.body;
    
    const result = await db.run(`
      UPDATE companies SET name = ?, website = ?, location = ?, industry = ?, notes = ?
      WHERE id = ? AND userId = ?
    `, [name, website, location, industry, notes, id, userId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    const company = await db.get('SELECT * FROM companies WHERE id = ?', [id]);
    res.json(company);
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete company
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const userId = req.user!.id;
    const { id } = req.params;
    
    const result = await db.run('DELETE FROM companies WHERE id = ? AND userId = ?', [id, userId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
