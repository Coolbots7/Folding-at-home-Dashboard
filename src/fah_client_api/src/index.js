const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Telnet = require('telnet-client');


const clients = [
  {
    id: 1,
    name: 'HAL-9000',
    host: '127.0.0.1',
    port: 36330
  },
  {
    id: 2,
    name: 'Happy',
    host: '192.168.2.42',
    port: 36330
  },
  {
    id: 3,
    name: 'Bashful',
    host: '192.168.2.46',
    port: 36330
  },
  {
    id: 4,
    name: 'pleiades-node-1',
    host: '192.168.2.70',
    port: 36330
  },
  {
    id: 5,
    name: 'pleiades-node-2',
    host: '192.168.2.71',
    port: 36330
  },
  {
    id: 6,
    name: 'pleiades-node-3',
    host: '192.168.2.72',
    port: 36330
  }
]

const telnetClientSend = (id, send) => new Promise((resolve, reject) => {
  const client = clients.find(c => c.id == id);

  if (client) {
    let params = {
      host: client.host,
      port: client.port,
      negotiationMandatory: false,
      timeout: 3000
    };

    let connection = new Telnet();

    connection.connect(params).then((prompt) => {
      connection.send(send).then((response) => {
        resolve(response);
      })
    });
  }
  else {
    reject();
  }

});

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {

  res.send("hi");
});

app.get('/clients', (req, res) => {
  res.send(clients);
});

app.get('/clients/:id', (req, res) => {
  const { id } = req.params;
  res.send(clients.find(c => c.id == id));
});

app.get('/clients/:id/slots', (req, res) => {
  const { id } = req.params;

  telnetClientSend(id, 'slot-info').then((response) => {
    const messages = parsePYoNMessage(response.toString());

    for (var i = 0; i < messages.length; i++) {
      const message = messages[i];
      const header = message.header;
      var body = message.body;

      if (header.type == "slots") {
        res.send(PYoNToJson(body));
      }
    }

    res.send([]);
  })
    .catch(() => {
      res.send([]);
    });
});

app.put('/clients/:id/status', (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (body.status == 'paused') {
    telnetClientSend(id, 'pause').then((response) => {
      res.send().status(202);
    });
  }
  else if (body.status == 'unpaused') {
    telnetClientSend(id, 'unpause').then((response) => {
      res.send().status(202);
    });
  }
  else if(body.status == 'finish') {
    telnetClientSend(id, 'finish').then((response) => {
      res.send().status(202);
    });
  }
  else {
    res.send(`Unknown status: ${body.status}`).status(400);
  }

});

app.put('/clients/:id/:slot/status', (req, res) => {
  const { id, slot } = req.params;
  const body = req.body;

  if (body.status == 'paused') {
    telnetClientSend(id, `pause ${slot}`).then((response) => {
      res.send().status(202);
    });
  }
  else if (body.status == 'unpaused') {
    telnetClientSend(id, `unpause ${slot}`).then((response) => {
      res.send().status(202);
    });
  }
  else if (body.status == 'finish') {
    telnetClientSend(id, `finish ${slot}`).then((response) => {
      res.send().status(202);
    });
  }
  else {
    res.send(`Unknown status: ${body.status}`).status(400);
  }
});

// starting the server
// app.listen(3001, () => {
//   console.log('listening on port 3001');
// });

const PYoNToJson = (pyon) => {
  pyon = pyon
    .replace(/False/g, "false")
    .replace(/True/g, "true");

  return JSON.parse(pyon);
};

const parsePYoNMessage = (data) => {
  var results = [];

  var messages = data.split(/[\r|\n]+---[\r|\n]*/);

  for (var i = 0; i < messages.length; i++) {
    let message = messages[i];

    let header = parsePYoNHeader(message);
    let body = parsePYoNBody(message);

    if (header) {
      header = { version: header[1], type: header[2] };
      let result = { header: header, body: body ? body[1] : body };
      results.push(result);
    }
  }

  return results;
}

const parsePYoNHeader = (data) => {
  return data.match(/[\w|\d]*PyON\s(\d*)\s(.*)[\r|\n]*/);
};

const parsePYoNBody = (data) => {
  return data.match(/^.*[\r|\n]*PyON\s\d+\s[\w|\d]+[\r|\n]+(.*)[\r|\n]*$/s);
}

const server = http.createServer(app);
const io = socketIo(server);


const connectTelnet = async () => {
  let connections = [];
  let client_ppd = {};

  for (var i = 0; i < clients.length; i++) {
    let client = clients[i];

    let params = {
      host: client.host,
      port: client.port,
      negotiationMandatory: false,
      timeout: 3000
    };

    let connection = new Telnet();

    //Telnet connect
    try {
      await connection.connect(params);
    }
    catch (error) {
      console.log("ERROR connect", error);
      return;
    }

    //Set update events
    try {
      await connection.send('updates clear');
      await connection.send('updates add 0 5 $heartbeat');
      await connection.send('updates add 1 1 $queue-info');
      await connection.send('updates add 2 1 $slot-info');
      await connection.send('updates add 3 1 $ppd');
    }
    catch (error) {
      console.log("ERROR updates", error);
      return;
    }

    connection.on('data', function (data) {
      //Convert buffer to string
      data = data.toString();
      messages = parsePYoNMessage(data);

      const header = messages[0].header;
      const body = messages[0].body;

      switch (header.type) {
        case 'heartbeat':
          io.emit("heartbeat", { id: client.id, count: body });
          break;
        case 'units':
          io.emit("queue-info", { id: client.id, queue: PYoNToJson(body) });
          break;
        case 'slots':
          io.emit("slot-info", { id: client.id, data: PYoNToJson(body) });
          break;
        case 'ppd':
          io.emit('ppd', { id: client.id, ppd: body });

          client_ppd[client.id] = parseFloat(body);
          var sum = 0;
          for (var key in client_ppd) {
            if (client_ppd.hasOwnProperty(key)) {
              sum += client_ppd[key];
            }
          }

          io.emit('ppd', { id: -1, ppd: sum });
          break;
        default:
          console.log("Unknown message type", header.type);
          break;
      }
    });

    connections[i] = connection;

  }

}
connectTelnet();

io.on("connection", socket => {
  console.log("New client connected");

  socket.on("disconnect", () => console.log("Client disconnected"));
});

let port = 3001;
server.listen(port, () => console.log(`Listening on port ${port}`));