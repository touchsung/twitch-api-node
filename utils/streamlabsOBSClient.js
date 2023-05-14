const StreamlabsOBSClient = require("streamlabs-obs-socket-client");
const dotenv = require("dotenv").config();

class MyStreamlabsOBSClient extends StreamlabsOBSClient {
  changeSourceProperty(sceneName, sourceName, properties) {
    const source = this.getSourceItemFromScene(sceneName, sourceName);
    const resource = `SceneItem["${source.sceneId}","${source.sceneItemId}","${source.sourceId}"]`;
    const message = {
      id: 10,
      jsonrpc: "2.0",
      method: "setTransform",
      params: {
        resource,
        args: [properties],
      },
    };
    this.send(message);
  }

  increaseSourceScale(sceneName, sourceName) {
    const source = this.getSourceItemFromScene(sceneName, sourceName);
    const properties = {
      scale: {
        x: source.transform.scale.x + 0.05,
        y: source.transform.scale.y + 0.05,
      },
    };
    this.changeSourceProperty(sceneName, sourceName, properties);
  }
  changeSourceScale(sceneName, sourceName, scaleX, scaleY) {
    const source = this.getSourceItemFromScene(sceneName, sourceName);
    const properties = {
      scale: {
        x: scaleX,
        y: scaleY,
      },
    };
    this.changeSourceProperty(sceneName, sourceName, properties);
  }

  changeSourcePosition(sceneName, sourceName, posX, posY) {
    const properties = {
      position: {
        x: posX,
        y: posY,
      },
    };
    this.changeSourceProperty(sceneName, sourceName, properties);
  }
}
const client = new MyStreamlabsOBSClient({
  token: process.env.STREAMLABS_TOKEN,
  port: process.env.STREAMLABS_PORT,
  uri: process.env.STREAMLABS_URI,
});

module.exports = client;
