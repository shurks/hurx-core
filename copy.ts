import { copyFileSync } from "fs";
import path from "path";

copyFileSync(path.join(__dirname, 'src', 'jsx.d.ts'), path.join(__dirname, 'dist', 'jsx.d.ts'))