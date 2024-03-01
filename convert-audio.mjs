import fs from 'fs';
import path from 'path';

const audioDir = path.join('public', 'audio');
const files = fs.readdirSync(audioDir);

for (const file of files) {
    const filePath = path.join(audioDir, file);
    const data = fs.readFileSync(filePath);
    const base64Data = data.toString('base64');
    const tsContent = `export const ${file.replace(/\.[^/.]+$/, '')} = '${base64Data}';`;
    fs.writeFileSync(path.join('src', 'audio', `${file.replace(/\.[^/.]+$/, '')}.ts`), tsContent);
}
