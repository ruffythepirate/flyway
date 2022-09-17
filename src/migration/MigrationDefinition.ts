import {isNameValid} from "./name-convention";

import * as fs from "fs";

export class MigrationDefinition {
    path: string;
    version: string;
    description: string;

    constructor(path: string, version: string, description: string) {
        this.path = path;
        this.version = version;
        this.description = description;
    }

    static parseMigration(path: string): MigrationDefinition {
        const filename = path.split("/").pop();
        if(filename === undefined || filename === '') {
           throw new Error(`Invalid path ${path}`);
        }
        if (!isNameValid(filename)) {
            throw new Error(`Invalid migration name: ${filename}`);
        }
        const [version, description] = filename.split("__");
        return new MigrationDefinition(path, version.substring(1), removeSuffix(description));
    }

    async verifyExists(): Promise<boolean> {
        try {
            await fs.promises.readFile(this.path);
            return true;
        } catch( e ) {
            return false;
        }
    }

    async readContent(): Promise<string> {
        return await fs.promises.readFile(this.path).then(r => r.toString());
    }
}

function removeSuffix(filename: string): string {
    return filename.substring(0, filename.lastIndexOf("."));
}
