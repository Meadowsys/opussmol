# opussmol

smol bit of stuff that takes an input music file and reencodes it using opus to try to get it as close to a floppy disk size (1440K) as possible without going over. More options and more docs coming soon

module use right now is not recommended, its quite disorganised and lacks documentation

not very customizable right now but does the job quite nicely

## installation

```sh
npm i -g opussmol
# or
pnpm i -g opussmol

# go to https://opus-codec.org/ to install opusenc, which is needed for this
opusenc --version # check its installed properly
```

## usage

```sh
opussmol --help

opussmol convert --filename inputfile.flac
# do this inside a clean working directory
# preferably on a hard drive as well, it creates and writes quite a bit of files

# itll print the final bitrate number, the end file will be at <filename>_bitrate<bitrate>.opus
```
