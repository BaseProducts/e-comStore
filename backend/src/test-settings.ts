import 'dotenv/config';
import Setting from './models/Setting.js';
import sequelize from './config/database.js';

async function testSettings() {
  try {
    console.log('--- Testing Settings Persistence ---');
    
    // 1. Try to find existing
    const allSettings = await Setting.findAll();
    console.log('Current Settings in DB:', allSettings.map(s => s.toJSON()));

    // 2. Try to update
    const testKey = 'tax_rate';
    const testValue = String(Math.floor(Math.random() * 20));
    
    console.log(`Setting ${testKey} to ${testValue}...`);
    
    const [setting, created] = await Setting.findOrCreate({
      where: { key: testKey },
      defaults: { key: testKey, value: testValue }
    });
    
    if (!created) {
      setting.value = testValue;
      await setting.save();
      console.log('Setting updated successfully.');
    } else {
      console.log('Setting created successfully.');
    }

    // 3. Verify
    const verify = await Setting.findOne({ where: { key: testKey } });
    console.log(`Verified value for ${testKey}:`, verify?.value);

    await sequelize.close();
  } catch (error) {
    console.error('Test Failed:', error);
  }
}

testSettings();
