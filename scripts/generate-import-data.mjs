import { promises as fs } from "fs";
import path from "path";

const generateImportIndex = async (dir, indexFile) => {

  const res = await fs.readdir(dir);

  let importPart =  '';
  let arrayPart = '';

  res.forEach((fileName) => {
    const unevilFileName = fileName.replace(/(\.ts)|(-)/g, '');

    if (unevilFileName === 'index') {
      return;
    }
    importPart += `import ${unevilFileName} from './${fileName.replace(/\.[t|j]s/g, '')}'; \n`;

    arrayPart += `\n  ${unevilFileName},`;
  });

  const fileContent = 
`${importPart}
const list = [${arrayPart} \n];

export default list;`

  await fs.writeFile(indexFile, fileContent)
}

(async () => {
  const root = path.resolve("./");
  const dataPath = root + "/data";

  const dataTypeList = ['game-events', 'enemies', 'items', 'skills', 'stories', 'states'];

  for(let dataType of dataTypeList) {
    const eventScriptPath = dataPath + `/${dataType}/script`;
    const eventIndexFilePath = dataPath + `/${dataType}/script/index.ts`;

    await generateImportIndex(eventScriptPath, eventIndexFilePath);
  }

  console.log('generate data successful');
  process.exit(0);
})();
