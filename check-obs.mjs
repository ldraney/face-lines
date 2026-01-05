import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

try {
  await obs.connect('ws://localhost:4455');
  console.log('Connected to OBS');

  // Update Face Overlay to point to new render server
  await obs.call('SetInputSettings', {
    inputName: 'Face Overlay',
    inputSettings: {
      url: 'http://localhost:3000'
    }
  });
  console.log('Updated URL to http://localhost:3000');

  await obs.call('PressInputPropertiesButton', {
    inputName: 'Face Overlay',
    propertyName: 'refreshnocache'
  });
  console.log('Refreshed browser source');

  await obs.disconnect();
} catch (e) {
  console.error('Error:', e.message);
}
