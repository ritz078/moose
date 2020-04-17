import os from "os";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const tempDir = fs.realpathSync(os.tmpdir());

export function getUniqueString() {
  return crypto
    .randomBytes(Math.ceil(5))
    .toString("hex")
    .slice(0, 10)
    .toUpperCase();
}

export function writeTemp(data, extension = "") {
  const _path = path.resolve(tempDir, `${getUniqueString()}${extension}`);
  fs.writeFileSync(_path, data);
  return _path;
}
