import fs from "fs-extra";

import { bitrates } from "./consts";
import { getnextarr, smolopts, tryencoding, tryencodingresult } from "./functions";


/**
 * @return bitrate of the final file
 */
// @return true if it seemed to be successful, false otherwise
export async function go(filename: string, opts: smolopts, nowtrying: (br: number) => any = () => {}, resultsize: (size: number) => any = () => {}): Promise<number> {
   const fileexists = !fs.existsSync(filename)
      ? new Error("file doesn't exist!") : false
   if (fileexists) throw fileexists;

   const arr0 = bitrates;
   const res0 = await tryencoding(filename, opts.target, arr0, nowtrying, resultsize);

   const arr1 = getnextarr(1, arr0, res0);
   const res1 = await tryencoding(filename, opts.target, arr1, nowtrying, resultsize);

   const arr2 = getnextarr(2, arr1, res1);
   const res2 = await tryencoding(filename, opts.target, arr2, nowtrying, resultsize);

   const arr3 = getnextarr(3, arr2, res2);
   const res3 = await tryencoding(filename, opts.target, arr3, nowtrying, resultsize);

   return arr3[res3.index - 1];
}

export * from "./consts";
export * from "./functions";
