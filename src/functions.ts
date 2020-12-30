import fs from "fs-extra";
import execa from "execa";

export const fileExists = (filename: string): boolean => fs.existsSync(filename);
export const getFileSize = (filename: string): number => fs.statSync(filename).size;
export const splitext = (filename: string) =>
   filename.includes(".") ? {
      filename: filename.substring(0, filename.lastIndexOf(".")),
      ext: filename.substring(filename.lastIndexOf(".") + 1)
   } : { filename, ext: "" };


// /**
//  * @param {number} filesize
//  * @return {number}
//  */
// const determineBeginningBitrate = filesize =>

export function convertfile(filename: string) {

}

export type convertopts = {
   filename: string;
   bitrate?: number;
   vbr: boolean;
   cwd?: string;
   // samplerate?: number;
};

export const convert = async (opts: convertopts): Promise<void> => {
   const cmdargs: Array<string> = [];
   opts.vbr && cmdargs.push("--vbr");
   opts.bitrate && cmdargs.push("--bitrate", `${opts.bitrate}`);
   // opts.samplerate && cmdargs.push("--raw-rate", `${opts.samplerate}`);

   const filename = splitext(opts.filename);
   cmdargs.push(`${opts.filename}`);
   // ${opts.samplerate ? `_samplerate${opts.samplerate}` : ""}
   cmdargs.push(`${filename.filename}${opts.bitrate ? `_bitrate${opts.bitrate}` : ""}.opus`);
   console.log(cmdargs);
   await execa("opusenc", cmdargs, {
      stdio: "inherit",
      extendEnv: false,
      env: process.env,
      cwd: opts.cwd ?? process.cwd()
   });
}
