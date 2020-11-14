import utility from "./scanner";
const [_command, _file, inputPath, outputPath, isJSON, ..._rest] = process.argv;

utility(inputPath, outputPath, !!isJSON);
