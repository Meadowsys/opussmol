import fs from "fs-extra";
import execa from "execa";
import { bitrates } from "./consts";

export const fileExists = (filename: string): boolean => fs.existsSync(filename);
export const getFileSize = (filename: string): number => fs.statSync(filename).size;
export const splitext = (filename: string) =>
   filename.includes(".") ? {
      filename: filename.substring(0, filename.lastIndexOf(".")),
      ext: filename.substring(filename.lastIndexOf(".") + 1)
   } : { filename, ext: "" };


/**
 * this needs tuning
 * @todo TUNE THIS
 */
export const determineBeginningBitrate = (filesize: number): number =>
   213.343 + (-0.00075192 * (filesize / 1000));

export const convertfile = async (filename: string): Promise<void> => {
   await convert({
      filename,
      vbr: true
   })
}

export type convertopts = {
   filename: string;
   bitrate?: number;
   vbr?: boolean;
   cwd?: string;
   // samplerate?: number;
};

export const convert = async (opts: convertopts): Promise<{ process: execa.ExecaReturnValue<string>, filename: string }> => {
   const cmdargs: Array<string> = [];
   opts.vbr && cmdargs.push("--vbr");
   opts.bitrate && cmdargs.push("--bitrate", `${opts.bitrate}`);
   // opts.samplerate && cmdargs.push("--raw-rate", `${opts.samplerate}`);

   const filename = splitext(opts.filename);
   cmdargs.push(`${opts.filename}`);
   // ${opts.samplerate ? `_samplerate${opts.samplerate}` : ""}
   const newfilename = `${filename.filename}${opts.bitrate ? `_bitrate${opts.bitrate}` : ""}.opus`;
   cmdargs.push(newfilename);
   return {
      process: await execa("opusenc", cmdargs, {
         stdio: "inherit",
         extendEnv: false,
         env: process.env,
         cwd: opts.cwd ?? process.cwd()
      }),
      filename: newfilename
   };
}

/**
 * creates an array of numbers of a range
 * @param start the start of the range, must be smaller than the end number
 * @param end the end of the range, must be larger than the end number
 * @param step number to increment by every time
 * @param arr array to append it to (usually leave this blank)
 * @return start to end numbers in array
 */
export const createrange = (start: number, end: number, step: number, arr: Array<number> = []): Array<number> =>
   start > end
   ? arr
   : void arr.push(start) || createrange(start + step, end, step, arr);

export type smolopts = {
   target: number;
   // tolerance: number;
};

export type tryencodingresult = {
   bitrate: number;
   index: number;
};
/**
 * encodes for each bitrate in totry, then stops and returns the first bitrate that exceeds the target
 */
export const tryencoding = async (filename: string, target: number, totry: ReadonlyArray<number> = bitrates, nowtrying: (br: number) => any = () => {}, resultsize: (size: number) => any = () => {}): Promise<tryencodingresult> => {
   let bitrate = 0;
   let index = 0;

   for (; index < totry.length; index++) {
      const tmp = totry[index];
      if (!tmp) continue;
      bitrate = tmp;

      nowtrying(bitrate);
      const res = await convert({
         filename: filename,
         bitrate: bitrate
      });

      const filesize = getFileSize(res.filename);
      resultsize(filesize);

      if (filesize > target) return { bitrate, index };
   }

   return { bitrate, index };
}

export const getnextarr = (round: 1 | 2 | 3, arr: ReadonlyArray<number>, res: tryencodingresult): ReadonlyArray<number> =>
   res.index >= 1 ? createrange(arr[res.index - 1], arr[res.index],
      round === 1 ? 5
      : round === 2 ? 1
      : 0.1
   ) : createrange(0, arr[res.index],
      round === 1 ? 5
      : round === 2 ? 1
      : 0.1
   )
