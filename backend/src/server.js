import { assertConfig, config } from './config.js';
import { createApp } from './app.js';

assertConfig();
createApp().listen(config.port, () => console.log(`API berjalan di http://localhost:${config.port}/api`));
