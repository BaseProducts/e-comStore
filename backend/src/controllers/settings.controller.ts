import type { Request, Response } from 'express';
import Setting from '../models/Setting.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Setting.findAll();
    const settingsMap = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    // Diagnostic: Do NOT set defaults here yet
    // This allows us to see if the DB is actually returning anything
    if (!settingsMap.tax_rate) settingsMap.tax_rate = null;
    if (!settingsMap.delivery_charge) settingsMap.delivery_charge = null;

    console.log('--- GET SETTINGS ---');
    console.log('DB Rows:', settings.length);
    console.log('Returning:', settingsMap);

    res.status(200).json({
      status: 'success',
      data: settingsMap
    });
  } catch (error: any) {
    console.error('GET SETTINGS ERROR:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { settings } = req.body; 
    console.log('--- UPDATE SETTINGS (UPSERT) ---');
    console.log('Payload:', settings);

    for (const [key, value] of Object.entries(settings)) {
      console.log(`Upserting ${key}: ${value}`);
      await Setting.upsert({ 
        key, 
        value: String(value) 
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Settings updated successfully'
    });
  } catch (error: any) {
    console.error('UPDATE SETTINGS ERROR:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
