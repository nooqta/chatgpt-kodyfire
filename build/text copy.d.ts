import { IConcept, ITechnology } from "kodyfire-core";
import { Concept as BaseConcept } from "basic-kodyfire";
export declare class Text extends BaseConcept {
    extension: string;
    params: any;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    generate(_data: any, api?: any, attemps?: number): Promise<void>;
    private prompt;
    private markdownToText;
    resolveTemplateName(templateName: string, name: string): string;
    getFilename(data: any): any;
    getExtension(templateName: string): string;
    getTemplatesPath(): string;
}
