import { IConcept, ITechnology } from "kodyfire-core";
import { Concept as BaseConcept } from "basic-kodyfire";
export declare class Md extends BaseConcept {
    extension: string;
    params: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    generate(_data: any, api?: any): Promise<void>;
    private prompt;
    resolveTemplateName(templateName: string, name: string): string;
    getFilename(data: any): any;
    getExtension(templateName: string): string;
    getTemplatesPath(): string;
}
