// @flow

type AsyncConfig = {
  delay: number,
  timeOut: number
};

type Config = {
  async: AsyncConfig
};

export default ({
  async: {
    delay: 500,
    timeOut: 5000
  }
}: Config);