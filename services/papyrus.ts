import { Papyrus } from "https://deno.land/x/papyrus@v1.0.0/mod.ts";
import { PapyrusFile } from "https://deno.land/x/papyrus_file@v1.0.0/papyrus-file.ts";
import { PapyrusPretty } from "https://deno.land/x/papyrus_pretty@v1.0.0/papyrus_pretty.ts";

const logger = new Papyrus({
  formatter: new PapyrusPretty(),
  //   transport: {
  //     use: new PapyrusFile({
  //       maxFileSize: '2 kB',
  //       //   rotate: true,
  //       //   timeFormat: "yyyyMMdd-hhmmssSSS"
  //     }),
  //   },
});

setInterval(() => {
  //   logger.debug('This is a warning', { a: 1 });
  logger.warn("This is a warning");
  logger.error("This is a warning");
  logger.trace("Level is trace");
  logger.debug("Level is debug");
  logger.info("Level is info");
  logger.warn("Level is warn");
  logger.error("Level is error");
}, 1000 * 3);
console.log("as");
