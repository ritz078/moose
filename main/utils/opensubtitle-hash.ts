import fs from "fs";

export async function getHash(
  filePath: string
): Promise<{
  movieHash: string;
  movieByteSize: string;
}> {
  return new Promise((resolve, reject) => {
    const HASH_CHUNK_SIZE = 64 * 1024;
    const bufStart = Buffer.alloc(HASH_CHUNK_SIZE * 2);
    const bufEnd = Buffer.alloc(HASH_CHUNK_SIZE * 2);
    let fileSize = 0;
    let checksum: string;
    let arrayChecksum = [];

    const checksumReady = (checksum_part) => {
      arrayChecksum.push(checksum_part);
      if (arrayChecksum.length === 3) {
        checksum = sumHex64bits(arrayChecksum[0], arrayChecksum[1]);
        checksum = sumHex64bits(checksum, arrayChecksum[2]);
        checksum = checksum.substr(-16);

        resolve({
          movieHash: checksum.padStart(16, "0"),
          movieByteSize: fileSize.toString(),
        });
      }
    };

    fs.stat(filePath, (err, stat) => {
      if (err) return reject(err);

      fileSize = stat.size;
      checksumReady(fileSize.toString(16));

      fs.open(filePath, "r", (err, fd) => {
        if (err) return reject(err);

        fs.read(
          fd,
          bufStart,
          0,
          HASH_CHUNK_SIZE * 2,
          0,
          (er1, bytesRead, buf1) => {
            fs.read(
              fd,
              bufEnd,
              0,
              HASH_CHUNK_SIZE * 2,
              fileSize - HASH_CHUNK_SIZE,
              (er2, bytesRead, buf2) => {
                fs.close(fd, (er3) => {
                  if (er1 || er2) return reject(er1 || er2); //er3 is not breaking
                  checksumReady(checksumBuffer(buf1, 16));
                  checksumReady(checksumBuffer(buf2, 16));
                });
              }
            );
          }
        );
      });
    });
  });
}

function read64LE(buffer: Buffer, offset) {
  const ret_64_be = buffer.toString("hex", offset * 8, (offset + 1) * 8);
  const array = [];
  for (let i = 0; i < 8; i++) {
    array.push(ret_64_be.substr(i * 2, 2));
  }
  array.reverse();
  return array.join("");
}

function checksumBuffer(buf: Buffer, length) {
  let checksum = "0";
  let checksum_hex = "0";
  for (let i = 0; i < buf.length / length; i++) {
    checksum_hex = read64LE(buf, i);
    checksum = sumHex64bits(checksum.toString(), checksum_hex).substr(-16);
  }
  return checksum;
}

function sumHex64bits(n1: string, n2: string) {
  if (n1.length < 16) n1 = n1.padStart(16, "0");
  if (n2.length < 16) n2 = n2.padStart(16, "0");

  // 1st 32 bits
  let n1First = n1.substr(0, 8);
  let n2First = n2.substr(0, 8);
  let i0 = parseInt(n1First, 16) + parseInt(n2First, 16);

  // 2nd 32 bits
  let n1Last = n1.substr(8, 8);
  let n2Last = n2.substr(8, 8);
  let i1 = parseInt(n1Last, 16) + parseInt(n2Last, 16);

  // back to hex
  let h1 = i1.toString(16);
  let i1Over = 0;
  if (h1.length > 8) {
    i1Over = parseInt(h1.substr(0, h1.length - 8), 16);
  } else {
    h1 = h1.padStart(8, "0");
  }

  const h0 = (i1Over + i0).toString(16);

  return h0 + h1.substr(-8);
}
