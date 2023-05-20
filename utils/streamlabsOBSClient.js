const StreamlabsOBSClient = require("streamlabs-obs-socket-client");
const dotenv = require("dotenv").config();

class MyStreamlabsOBSClient extends StreamlabsOBSClient {
  constructor(opts) {
    super(opts);
    this.goForward = true;
  }
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
    this.changeSourceScale(
      sceneName,
      sourceName,
      source.transform.scale.x > 0
        ? source.transform.scale.x + 0.05
        : source.transform.scale.x - 0.05,
      source.transform.scale.y + 0.05
    );
    const properties = {
      position: {
        y: 1080 - source.transform.scale.y * 120,
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

  walkSourcePosition(sceneName, sourceName) {
    const source = this.getSourceItemFromScene(sceneName, sourceName);
    let step = 10;
    let scaleX = source.transform.scale.x;
    let startPosition;

    if (source.transform.position.x < 0) {
      this.goForward = true;
      startPosition = Math.abs(source.transform.scale.x) * 170;
    } else if (source.transform.position.x > 1920) {
      this.goForward = false;
      startPosition = 1920 - Math.abs(source.transform.scale.x) * 170;
    }

    if (startPosition) {
      this.changeSourceScale(
        sceneName,
        sourceName,
        scaleX * -1,
        source.transform.scale.y
      );
    }
    this.changeSourcePosition(
      sceneName,
      sourceName,
      this.goForward
        ? startPosition || source.transform.position.x + Math.abs(scaleX) * step
        : startPosition ||
            source.transform.position.x - Math.abs(scaleX) * step,
      source.transform.position.y
    );
    this.turnSide = false;
  }
}
const client = new MyStreamlabsOBSClient({
  token: process.env.STREAMLABS_TOKEN,
  port: process.env.STREAMLABS_PORT,
  uri: process.env.STREAMLABS_URI,
});

module.exports = client;
