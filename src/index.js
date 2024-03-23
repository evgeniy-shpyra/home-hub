import config from '../config.json' assert { type: 'json' }
import ws from "ws"


const app = async () => {
  try{
    ws = new WebSocket(`ws://${config.mainServer.host}:${config.mainServer.port}/ws`);

    ws.on('error', console.error);
    
    ws.on('open', function open() {
      console.log('Open connection')
    });

    ws.on('message', function incoming(data) {
      console.log('Received message from server:', data);
  });

  } catch(e) {
    console.log(e)
  }
}

await app()